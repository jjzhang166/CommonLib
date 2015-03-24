#include <stdio.h>
#include <string>

#include "msglog.h"
#include "EncodeAAC.h"
#include "SaveFileHelper.h"

#define SRC_FILE "audioFrm.pcm"
#define PCM_SAMPLE 8000
#define PCM_BIT 16
#define PCM_CHANNEL 1
#define PCM_LEN_PER_FRAME 1600//(1024 * PCM_CHANNEL * (PCM_BIT/8))

char inBuf[PCM_LEN_PER_FRAME];
SFHelper g_SFH;
EncodeAAC g_EcAAC;

void EcAACCB(unsigned char* encData, int len, unsigned int timestamp, int index);


int main(int argc, char* argv[])
{
	FILE* fp = fopen(SRC_FILE, "rb");
	if(fp == NULL)
	{
		LOG(LEVEL_ERROR, "open file(%s) failed!\n", SRC_FILE);
		return -101;
	}

	
	if(! g_EcAAC.openAudioEncoder(PCM_SAMPLE, PCM_BIT, PCM_CHANNEL, EcAACCB, 0))
	{
		LOG(LEVEL_ERROR, "openAudioEncoder failed!\n");
		return -102;
	}

	while(true)
	{
		if(PCM_LEN_PER_FRAME != fread(inBuf, sizeof(char), PCM_LEN_PER_FRAME, fp))
		{
			printf("fread failed! err=%d.\n", ferror(fp));
			break;
		}
		
		if(0 > g_EcAAC.encodeAudio(inBuf, PCM_LEN_PER_FRAME, 4000))
		{
			printf("encodeAudio failed!#######\n");
		}
	}

	getchar();
	return 0;
}

void EcAACCB(unsigned char* encData, int len, unsigned int timestamp, int index)
{
	g_SFH.SF_write((char*)encData, len, NULL, g_SFH.SF_open("enAudio.aac"));
	LOG(LEVEL_INFO, "Encode AAC success, size(%d), stamp(%d).\n", len, timestamp);
}
