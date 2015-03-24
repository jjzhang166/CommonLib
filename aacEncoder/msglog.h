/*
 * =====================================================================================
 * 
 *       Filename:  logmsg.h
 * 
 *    Description:  
 * 
 *        Version:  1.0
 *        Created:  2008???5???4???14???2???3???CST
 *       Revision:  none
 *       Compiler:  gcc
 * 
 *         Author:   (), 
 *        Company:  
 * 
 * =====================================================================================
 */

#ifndef  LOGMSG_INC
#define  LOGMSG_INC

#define LEVEL_DEBUG		(1<<1)
#define LEVEL_INFO		(1<<2)
#define LEVEL_WARNING	(1<<3)
#define LEVEL_ERROR		(1<<4)
#define LEVEL_EMERG		(1<<5)

#ifdef WIN32
#include <windows.h>
#endif

#ifdef __cplusplus
extern "C" {
#endif

/************************************************
 * 输入：无
 * 输出：无
 * 返回：无
 ************************************************/
void log_init(char *ModuleName);


/************************************************
 * 输入：无
 * 输出：无
 * 返回：无
 ************************************************/
void log_deinit(void);



/************************************************
 * 输入：mask = LEVEL_INFO | LEVEL_DEBUG | ...
 * 输出：无
 * 返回：无
 ************************************************/
void log_level(unsigned int mask);



/************************************************
 * 输入：level???LEVEL_INFO ..., module_name: 模块名称, msg: 输出消息 
 * 输出：无
 * 返回：无
 ************************************************/
void log_msg(unsigned int level, const char *msg, ...);

#ifdef __linux__
#define LOG(level, fmt, args...)	log_msg(level, "[%s(%d):%s() ] "fmt, __FILE__, __LINE__, __FUNCTION__, ##args) 
#else
#define LOG(level, fmt, ...)		log_msg(level, "[%s(%d):%s() ] "fmt, __FILE__, __LINE__, __FUNCTION__, __VA_ARGS__)
#endif


#ifdef __cplusplus
}
#endif
#endif   /* ----- #ifndef LOGMSG_INC  ----- */

