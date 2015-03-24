#include <stdio.h>
#include <map>
#include <string.h>

#ifdef WIN32
#include <windows.h>
#endif//WIN32

#ifdef _THREAD_SAFE_
#include "pthread.h"
#pragma comment(lib, "pthreadVC2.lib")

class LockerHelper_Wr
{
public:
	LockerHelper_Wr(pthread_rwlock_t* rwlock)
	{
		m_rwlock = rwlock;
		pthread_rwlock_wrlock(m_rwlock);
	}
	~LockerHelper_Wr()
	{
		pthread_rwlock_unlock(m_rwlock);
	}

private:
	pthread_rwlock_t* m_rwlock;
};//LockerHelper_Wr

class LockerHelper_Rd
{
public:
	LockerHelper_Rd(pthread_rwlock_t* rwlock)
	{
		m_rwlock = rwlock;
		pthread_rwlock_rdlock(m_rwlock);
	}
	~LockerHelper_Rd()
	{
		pthread_rwlock_unlock(m_rwlock);
	}

private:
	pthread_rwlock_t* m_rwlock;
};//LockerHelper_Rd

pthread_rwlock_t g_sfhLock = PTHREAD_RWLOCK_INITIALIZER;

#endif//_THREAD_SAFE_


#if 0//map-自定义key的使用1
//此方法必须在类中定义成员函数，才有效
inline bool operator < (const std::string &key1,const std::string &key2)  
{  
	return (key1.compare(key2) < 0);
}

inline bool operator == (const std::string &key1,const std::string &key2)
{
	return (key1.compare(key2) == 0);
}

typedef std::map<std::string, FILE*> FILE_CAN;
#else//map-自定义key的使用2
struct comp
{
	typedef std::string value_type;  

	bool operator () (const value_type & ls, const value_type &rs)  
	{
		return (ls.compare(rs) < 0);  
	}
};

typedef std::map<std::string, FILE*, comp> FILE_CAN;
#endif


class SFHelper
{
public:
	SFHelper(void)
	{
		m_readyList.clear();
	}

	~SFHelper(void)
	{
		SF_clear();
	}

public:
	FILE* SF_open(char* filename)
	{
		{
#ifdef _THREAD_SAFE_
			LockerHelper_Rd locker(&g_sfhLock);
#endif//_THREAD_SAFE_

			std::string fn(filename);
			FILE_CAN::iterator it = m_readyList.find(fn);
			if(it != m_readyList.end())
			{//同名文件已存在并打开
				return it->second;
			}
		}

		//新建文件并打开
		FILE* fp = fopen(filename, "wb");
		if(fp != NULL)
		{
#ifdef _THREAD_SAFE_
			LockerHelper_Wr locker(&g_sfhLock);
#endif//_THREAD_SAFE_

			std::string fn(filename);
			std::pair<FILE_CAN::iterator, bool> ret = m_readyList.insert(FILE_CAN::value_type(fn, fp));
			if(! ret.second)
			{
				fclose(fp);
				return NULL;
			}
			return ret.first->second;
		}
		else
		{
			return NULL;
		}
	}

	//文件名filename，文件指针fp，选择其一即可，但以文件名为主
	bool SF_write(char* data, int len, char* filename, FILE* fp = NULL)
	{
#ifdef _THREAD_SAFE_
		LockerHelper_Rd locker(&g_sfhLock);
#endif//_THREAD_SAFE_

		FILE* readyFP = NULL;

		if(filename != NULL)
		{
			std::string fn(filename);
			FILE_CAN::iterator exist = m_readyList.find(fn);
			if(exist != m_readyList.end())
			{
				readyFP = exist->second;
			}
		}
		else if(fp != NULL)
		{
			for(FILE_CAN::iterator it = m_readyList.begin(); it != m_readyList.end(); it++)
			{
				if(it->second == fp)
				{
					readyFP = it->second;
					break;
				}
			}
		}
		else
		{
			readyFP = NULL;
		}

		if(readyFP != NULL)
		{
			fwrite(data, sizeof(char), len, readyFP);
			return true;
		}
		else
		{
			return false;
		}
	}

	bool SF_close(char* filename, FILE* fp = NULL)
	{
#ifdef _THREAD_SAFE_
		LockerHelper_Wr locker(&g_sfhLock);
#endif//_THREAD_SAFE_

		FILE* readyFP = NULL;

		std::string fn(filename);
		FILE_CAN::iterator exist = m_readyList.find(fn);
		if(exist != m_readyList.end())
		{
			readyFP = exist->second;
		}
		else if(fp != NULL)
		{
			for(FILE_CAN::iterator it = m_readyList.begin(); it != m_readyList.end(); it++)
			{
				if(it->second == fp)
				{
					readyFP = it->second;
					m_readyList.erase(it);
					break;
				}
			}
		}
		else
		{
			readyFP = NULL;
		}

		if(readyFP != NULL)
		{
			fclose(readyFP);
			return true;
		}
		else
		{
			return false;
		}
	}

	bool SF_clear(void)
	{
#ifdef _THREAD_SAFE_
		LockerHelper_Wr locker(&g_sfhLock);
#endif//_THREAD_SAFE_

		for(FILE_CAN::iterator it = m_readyList.begin(); it != m_readyList.end(); it++)
		{
			fclose(it->second);
		}
		m_readyList.clear();

		return true;
	}

private:
	FILE_CAN m_readyList;

};//SFHelper