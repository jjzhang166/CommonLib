#pragma once

#include <stdio.h>
#include <vector>
#include <string.h>

extern "C"
{
#include "libavcodec\avcodec.h"
#include "libavformat\avformat.h"
#include "libswscale\swscale.h"
};

#pragma comment (lib,"avcodec.lib")
#pragma comment (lib,"avformat.lib")
#pragma comment (lib,"avutil.lib")
#pragma comment (lib,"avdevice.lib")
#pragma comment (lib,"avfilter.lib")
#pragma comment (lib,"swscale.lib")


#define A_BIT_RATE_8k	8000
#define A_BIT_RATE_16k	16000
#define A_BIT_RATE_32k	32000
#define A_BIT_RATE_64k	64000
#define A_BIT_RATE_128k	128000

typedef void (*encAudioCB) (unsigned char* encData, int len, unsigned int timestamp, int index);

class EncodeAAC
{
public:
	EncodeAAC(void)
	{
		aFrameNum = 0;
		preA_Stamp = 0;

		samples = NULL;
		audio_outbuf = NULL;
		audio_outbuf_size = 0;
		audio_input_frame_size = 0;
		fmt = NULL;
		avFmtCnt = NULL;
		audio_st = NULL;
		avCdCnt = NULL;

		m_outCB = NULL;
		m_outObj = 0;

		m_sampleSize = 0;
	}
	~EncodeAAC(void)
	{
	}
	
	bool openAudioEncoder(unsigned int samplePerSecond, unsigned char bitPerSample, unsigned char channels, encAudioCB cb, int index);

	int getAudioFrameSize(void)
	{
		return m_sampleSize;
	}

	int encodeAudio(char* inData, int inLen, unsigned int timestamp);

	bool closeAudioEncoder(void);

private:
	unsigned int aFrameNum;
	unsigned int preA_Stamp;

	short *samples;
	unsigned char *audio_outbuf;
	int audio_outbuf_size;
	int audio_input_frame_size;
	AVOutputFormat *fmt;
	AVFormatContext *avFmtCnt;
	AVStream * audio_st;
	AVCodecContext* avCdCnt;

	encAudioCB m_outCB;
	int m_outObj;

	int m_sampleSize;
	std::vector<char> m_aData;
	std::vector<char> m_aResData;
};
