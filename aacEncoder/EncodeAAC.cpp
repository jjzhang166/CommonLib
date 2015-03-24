#include "EncodeAAC.h"

bool EncodeAAC::openAudioEncoder(unsigned int samplePerSecond, unsigned char bitPerSample, unsigned char channels, encAudioCB cb, int index)
{
	av_register_all();
	
	const char* filename = "test.acc";
	fmt = guess_format("adts", NULL, NULL);//(NULL, filename, NULL);
	avFmtCnt = av_alloc_format_context();
	avFmtCnt->oformat = fmt;
	snprintf(avFmtCnt->filename, sizeof(avFmtCnt->filename), "%s", filename);
	audio_st = NULL;
	avCdCnt = NULL;
	
	if (fmt->audio_codec != CODEC_ID_NONE)
	{
		audio_st = av_new_stream(avFmtCnt, 1);
		avCdCnt = audio_st->codec;
		avCdCnt->codec_id = fmt->audio_codec;
		avCdCnt->codec_type = CODEC_TYPE_AUDIO;
		int orgBR = (samplePerSecond * bitPerSample * channels)/8;
		int lvl = orgBR / A_BIT_RATE_8k / 2;
		int bitPerSecond = A_BIT_RATE_8k << lvl;
		//avCdCnt->bit_rate = A_BIT_RATE;
		avCdCnt->bit_rate = bitPerSecond;//(orgBR > 128000) ? (A_BIT_RATE_128k) : (A_BIT_RATE_8k);
		avCdCnt->sample_rate = samplePerSecond;//44100;
		avCdCnt->channels = channels;//2;
	}
	if (av_set_parameters(avFmtCnt, NULL) < 0)
	{
		return false;
	}
	dump_format(avFmtCnt, 0, filename, 1);
	if (avCdCnt)
	{
		AVCodec* codec = NULL;
		codec = avcodec_find_encoder(avCdCnt->codec_id);
		avcodec_open(avCdCnt, codec);
		audio_outbuf_size = 10000;//根据bitPerSecond计算
		audio_outbuf = (uint8_t*)av_malloc(audio_outbuf_size);
		if (avCdCnt->frame_size <= 1)
		{
			audio_input_frame_size = audio_outbuf_size / avCdCnt->channels;
			switch (audio_st->codec->codec_id)
			{
			case CODEC_ID_PCM_S16LE:
			case CODEC_ID_PCM_S16BE:
			case CODEC_ID_PCM_U16LE:
			case CODEC_ID_PCM_U16BE:
				audio_input_frame_size >>= 1;
				break;
			default:
				break;
			}
		}
		else
		{
			audio_input_frame_size = avCdCnt->frame_size;
		}
		m_sampleSize = audio_input_frame_size*avCdCnt->channels*(bitPerSample/8);
		samples = (int16_t*)av_malloc(m_sampleSize);
	}
	
	if (!(!fmt->flags & AVFMT_NOFILE))
	{
		printf("ypeng@ Open decoder failed##########!\n");
		return false;
	}

	m_outObj = index;
	m_outCB = cb;
	printf("ypeng@ Open decoder success!\n");
	return true;
}

int EncodeAAC::encodeAudio(char* inData, int inLen, unsigned int timestamp)
{
#if 0
		static FILE* aeFp_src = fopen("vi04.pcm", "wb");
		static int aeCnt_src = 0;
		if(NULL == aeFp_src)
		{
			goto SAVESRC_FAIL;
		}
		aeCnt_src++;
		if(aeCnt_src < 600)
		{
			fwrite(&_audio_buf[0], 1, _audio_buf.size(), aeFp_src);
		}
		else
		{
			fflush(aeFp_src);
			fclose(aeFp_src);
		}
SAVESRC_FAIL:
#endif
	int resLen = m_aResData.size();
	m_aData.resize(resLen + inLen);
	if(resLen > 0)
	{
		memcpy(&m_aData[0], &m_aResData[0], resLen);
	}
	memcpy(&m_aData[resLen], inData, inLen);

	//保存剩余数据
	resLen = m_aData.size() - m_sampleSize;
	if(resLen > 0)
	{
		m_aResData.resize(resLen);
		memcpy(&m_aResData[0], &m_aData[m_sampleSize], m_aResData.size());
	}
	else if(resLen == 0)
	{
		m_aResData.clear();
	}
	else
	{
		m_aResData.resize(m_aData.size());
		memcpy(&m_aResData[0], &m_aData[0], m_aResData.size());
		printf("now data not enough! dataLen(%d) < sampleSize(%d).\n", m_aData.size(), m_sampleSize);
		return 0;
	}

	memcpy(samples, &m_aData[0], m_sampleSize);
	//编码
	int dataSize = avcodec_encode_audio(avCdCnt, audio_outbuf, audio_outbuf_size, samples);
	if(dataSize < 0)
	{
		printf("avcodec_encode_audio2 failed!\n");
		return -1;
	}

	if(aFrameNum % 200 == 1)
	{
		printf("ypeng@ Audio decoder output! aFrameNum=%u, timestamp=%u, stampDif=%u, dataSize=%d\n", aFrameNum, timestamp, timestamp-preA_Stamp, dataSize);
	}
#ifdef A_READFILE
		char* aacData = NULL;
		int aacSize = 0;
		_aacHelper->getNext(&aacData, aacSize);
		if(NULL != aacData && 0 != aacSize)
		{
			req_audio(timestamp, aacSize, (u_int8*)aacData);
			if(aFrameNum % 200 == 1)
			{
				printf("ypeng@ ReadFile output! aFrameNum=%u, timestamp=%u, stampDif = %d, aacSize=%d.\n", aFrameNum, timestamp, timestamp-preA_Stamp, aacSize);
			}
		}
#else
		//req_audio(timestamp, dataSize, audio_outbuf);
	if(dataSize > 0 && m_outCB != NULL)
	{
		m_outCB(audio_outbuf, dataSize, timestamp, m_outObj);
	}
#endif
		
#if 0//def A_READFILE
		static FILE* aeFp = fopen("vi04.aac", "wb");
		static int aeCnt = 0;
		if(NULL == aeFp)
		{
			goto SAVE_FAIL;
		}
		aeCnt++;
		if(aeCnt < 100000)
		{
			fwrite(audio_outbuf, sizeof(char), dataSize, aeFp);
		}
		else
		{
			fflush(aeFp);
			fclose(aeFp);
			aeFp = NULL;
		}
SAVE_FAIL:
#endif

	preA_Stamp = timestamp;
	return (dataSize);
}

bool EncodeAAC::closeAudioEncoder()
{
	if (audio_st)
	{
		avcodec_close(audio_st->codec);
		av_free(samples);
		av_free(audio_outbuf);
	}
	for (int i=0; i<avFmtCnt->nb_streams; i++)
	{
		av_freep(&avFmtCnt->streams[i]->codec);
		av_freep(&avFmtCnt->streams[i]);
	}
	av_free(avFmtCnt);

	printf("ypeng@ Close audio decoder!\n");
	return true;
}