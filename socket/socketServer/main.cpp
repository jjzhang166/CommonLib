#include <stdio.h>

#ifdef WIN32
#include <WinSock2.h>
#pragma comment(lib, "Ws2_32.lib")
#else
#include <sys/socket.h>
#endif

int main(int argc, char *argv[])
{
	int ret = 0;
#ifdef WIN32
	/*
	�� wVersionRequested��һ��WORD��˫�ֽڣ�����ֵ������߰汾��Windows Sockets֧�ֵ�����ʹ�ã��߽��ֽ�ָ��С�汾(�޶���)��,��λ�ֽ�ָ�����汾�š�
	��lpWSAData ָ��WSADATA���ݽṹ��ָ�룬��������Windows Sockets[1]  ʵ�ֵ�ϸ�ڡ�
		WindowsSockets API�ṩ�ĵ��÷���ʹ�õ���߰汾�š���λ�ֽ�ָ�����汾(����)�ţ���λ�ֽ�ָ�����汾�š�
	*/
	WSADATA data;
	if(0 != WSAStartup(MAKEWORD(1,1), &data))
	{
		printf("WSAStartup failed!(%d)\n", WSAGetLastError());
		ret = -1;
		goto FAILED;
	}
#endif
	/*
	af��һ����ַ������Ŀǰ��֧��AF_INET��ʽ��Ҳ����˵ARPA Internet��ַ��ʽ��
	type��ָ��socket���͡����׽ӿڵ������������ͣ���TCP��SOCK_STREAM����UDP��SOCK_DGRAM����
		���õ�socket�����У�SOCK_STREAM��SOCK_DGRAM��SOCK_RAW��SOCK_PACKET��SOCK_SEQPACKET�ȵȡ�
	protocol������˼�壬����ָ��Э�顣�׽ӿ����õ�Э�顣������߲���ָ��������0��
		���õ�Э���У�IPPROTO_TCP��IPPROTO_UDP��IPPROTO_STCP��IPPROTO_TIPC�ȣ����Ƿֱ��ӦTCP����Э�顢UDP����Э�顢STCP����Э�顢TIPC����Э�顣
	*/
	SOCKET serSock = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
	if(INVALID_SOCKET == serSock)
	{
		printf("socket failed!(%d)\n", WSAGetLastError());
		ret = -2;
		goto FAILED;
	}

	int val = 1;
	setsockopt(serSock, SOL_SOCKET, SO_REUSEADDR, reinterpret_cast<char*>(&val), sizeof(val));

	SOCKADDR_IN addr;
	addr.sin_addr.S_un.S_addr = INADDR_ANY;
	addr.sin_family = AF_INET;
	addr.sin_port = htons(50012);
	if(SOCKET_ERROR == bind(serSock, (LPSOCKADDR)&addr, sizeof(SOCKADDR_IN)))
	{
		printf("bind failed!(%d)\n", WSAGetLastError());
		ret = -3;
		goto FAILED;
	}

	/*
	backlog �����������(queue of pending connections)
	����󳤶ȣ�һ����2��4������SOMAXCONN����
	ϵͳȷ��
	*/
	listen(serSock, 128);

	while(true)
	{
		timeval time = {1, 1*1000};
		fd_set fds;
		FD_ZERO(&fds);
		FD_SET(serSock, &fds);
		int rr = select(FD_SETSIZE, &fds, NULL, NULL, &time);
		if(rr > 0)
		{
			SOCKET clnSock = accept(serSock, NULL, NULL);
			if(INVALID_SOCKET == clnSock)
			{
				printf("accept failed!(%d)\n", WSAGetLastError());
				ret = -4;
				goto FAILED;
			}

			char buf[1024] = {0};
			int readNum = recv(clnSock, buf, sizeof(buf), 0);
			if(readNum > 0)
			{
				printf("server recv buf(%s)", buf);
				int sendNum = send(clnSock, buf, readNum, 0);
				goto SUCCESS;
			}

#ifdef WIN32
			closesocket(clnSock);
#else
#endif
		}
		else if (rr < 0)
		{
			printf("select failed!(%d)\n", WSAGetLastError());
			ret = -5;
			goto FAILED;
		}
		else
		{
			puts("selecting...\n");
			continue;
		}
	}
	
SUCCESS:
FAILED:
#ifdef WIN32
	closesocket(serSock);
	WSACleanup();
#else
	close(serSock);
#endif

	getchar();
	return ret;
}