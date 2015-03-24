/*
 * =====================================================================================
 *
 *       Filename:  logmsg.cpp
 *
 *    Description:  
 *
 *        Version:  1.0
 *        Created:  
 *       Revision:  none
 *       Compiler:  gcc
 *
 *         Author:  LXC 
 *        Company:  VTRON
 *
 * =====================================================================================
 */

#include <stdio.h>
#include <stdlib.h>
#include <stdarg.h>
#ifdef __linux__
#include <syslog.h>
#include <pthread.h>
#include <unistd.h>
#endif
#include <string.h>
#include <ctype.h>
#include "msglog.h"
#define MSG_MAX_LEN		1024
#define PATHFILE1		"/opt/etc/log.conf"
#define PATHFILE2		"/vtron/etc/log.conf"
#define LOCAL_LOG

static char* strupper(char *src);

static const char *m_Level[] =
{
	"debug",
	"info",
	"warning",
	"error",
	"emerg"
};


#ifdef WIN32
static unsigned int m_Mask  = LEVEL_DEBUG | LEVEL_INFO | LEVEL_WARNING | LEVEL_ERROR | LEVEL_EMERG;
static unsigned int m_Local = 1;
#else
static unsigned int m_Mask  = 0;
static unsigned int m_Local = 0;
#endif	

static unsigned int m_Init    = 0;
static unsigned int m_Reset   = 0;
static char			Name[128] = {'\0'};


void  log_init_local(char *ModuleName);
void  log_deinit_local(void);
void* deamon(void *param);
void  get_config(unsigned int* pmask, unsigned int* plocal);

#ifdef WIN32
void log_init(char *ModuleName)
{
	if(m_Init)
		return;

	m_Init = 1;

	if(ModuleName)
	{
		strcpy(Name, ModuleName);
	}
	else
	{
		char module[256];
		char *end = NULL;
		GetModuleFileName(NULL, module, sizeof(module));

		end = strrchr(module, '\\');
		if(end == NULL)
		{
			end = strrchr(module, '/');
			if(end == NULL)
				end = module;
		}

		strcpy(Name, ++end);
		strupper(Name);
	}
}
#else
void log_init(char *ModuleName)
{
	pthread_t hpth;

	get_config(&m_Mask, &m_Local);

	pthread_create(&hpth, NULL, deamon, NULL);

	log_init_local(ModuleName);
}

void log_init_local(char *ModuleName)
{
	char *id;

	if(m_Init==1)
		return;

	m_Init = 1;

	//设置日志前缀
	if(ModuleName==NULL)
	{
		id = NULL;
	}
	else
	{
		strncpy(Name, ModuleName, 128);
		strupper(Name);
		Name[127] = '\0';
		id = Name;
	}

	if(m_Local==1)
	{
		openlog(id, LOG_PERROR|LOG_NOWAIT, LOG_LOCAL1);
	}
	else
	{
		openlog(id, LOG_NOWAIT, LOG_LOCAL1);
	}
}

void* deamon(void *param)
{
	(void)param;

	while(1)
	{
		unsigned int mask, local;

		get_config(&mask, &local);

		if(mask != m_Mask || local != m_Local)
		{
			m_Mask  = mask;
			m_Local = local;
			m_Reset = 1;
		}		

		usleep(1000000*5);
	}

	return NULL;
}

#endif

void log_deinit(void)
{
	log_deinit_local();
}

void log_deinit_local(void)
{
	if(m_Init==0)
		return;

	m_Init = 0;
#ifdef __linux__
	closelog();
#endif
}

void get_config(unsigned int* pmask, unsigned int* plocal)
{
	FILE *fin = NULL;
	char data[256];

#ifdef RELEASE
	*pmask  = LEVEL_ERROR | LEVEL_EMERG;
	*plocal = 0;
#else
	*pmask  = LEVEL_DEBUG | LEVEL_INFO | LEVEL_WARNING | LEVEL_ERROR | LEVEL_EMERG;
	*plocal = 1;
#endif

	//查看日志级别设置
	fin = fopen(PATHFILE1, "r+b");
	if(fin==NULL)
	{
		fin = fopen(PATHFILE2, "r+b");
	}

	if(fin)
	{
		memset(data, 0, sizeof(data));
		fread(data, sizeof(data), 1, fin);
		fclose(fin);
		data[255] = '\0';
		strupper(data);

		if(strstr(data, "LEVEL=DEBUG")!=NULL)
			*pmask  = LEVEL_INFO | LEVEL_DEBUG | LEVEL_WARNING | LEVEL_ERROR | LEVEL_EMERG;
		else if(strstr(data, "LEVEL=INFO")!=NULL)
			*pmask  = LEVEL_INFO | LEVEL_WARNING | LEVEL_ERROR | LEVEL_EMERG;
		else if(strstr(data, "LEVEL=WARNING")!=NULL)
			*pmask  = LEVEL_WARNING | LEVEL_ERROR | LEVEL_EMERG;
		else if(strstr(data, "LEVEL=ERROR")!=NULL)
			*pmask  = LEVEL_ERROR | LEVEL_EMERG;
		else if(strstr(data, "LEVEL=EMERG")!=NULL)
			*pmask  = LEVEL_EMERG;

		if(strstr(data, "LOCAL=YES") != NULL)
			*plocal = 1;
		else
			*plocal = 0;
	}
}

void log_level(unsigned int mask)
{
	m_Mask = mask;
}

#ifdef WIN32
void log_msg(unsigned int level, const char *fmt, ...)
{
	int index;
	char output[MSG_MAX_LEN], *msg;
	va_list ap;

	if(m_Init == 0)
	{
		log_init(NULL);
	}

	if( (level & m_Mask)==0 )
		return;

	sprintf(output, "%s: ", Name);

	if(level&LEVEL_DEBUG)
		index = 0;
	else if(level&LEVEL_INFO)
		index = 1;
	else if(level&LEVEL_WARNING)
		index = 2;
	else if(level&LEVEL_ERROR)
		index = 3;
	else if(level&LEVEL_EMERG)
		index = 4;
	else
		return;

	sprintf(output+strlen(output), "[%-8s] - ", m_Level[index]);
	
	msg = output + strlen(output);
	va_start(ap, fmt);
	vsnprintf(msg, sizeof(output) - (msg - output),  fmt, ap);
	va_end(ap);

	strcat(output, "\n");
		
	OutputDebugStringA(output);
}

#else

void log_msg(unsigned int level, const char *fmt, ...)
{
	int index;
	char output[MSG_MAX_LEN], *msg;
	va_list ap;

	if(m_Init == 0)
	{
		log_init(NULL);
	}

	if(m_Reset == 1)
	{
		m_Reset = 0;
		log_deinit_local();
		log_init_local(strlen(Name)>0?Name:NULL);
	}

	if( (level & m_Mask)==0 )
		return;

	if(level&LEVEL_DEBUG)
		index = 0;
	else if(level&LEVEL_INFO)
		index = 1;
	else if(level&LEVEL_WARNING)
		index = 2;
	else if(level&LEVEL_ERROR)
		index = 3;
	else if(level&LEVEL_EMERG)
		index = 4;
	else
		return;

	sprintf(output, "[%-8s] - ", m_Level[index]);
	
	msg = output + strlen(output);
	va_start(ap, fmt);
	vsnprintf(msg, sizeof(output) - (msg - output),  fmt, ap);
	va_end(ap);
		
	syslog(LOG_INFO, output);
}
#endif

static char* strupper(char *src)
{
	char *strRet = src;

	while(*src)
	{
		*src = toupper(*src);
		src++;
	}

	return strRet;
}











