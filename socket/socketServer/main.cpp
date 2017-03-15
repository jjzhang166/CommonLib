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
	⑴ wVersionRequested：一个WORD（双字节）型数值，在最高版本的Windows Sockets支持调用者使用，高阶字节指定小版本(修订本)号,低位字节指定主版本号。
	⑵lpWSAData 指向WSADATA数据结构的指针，用来接收Windows Sockets[1]  实现的细节。
		WindowsSockets API提供的调用方可使用的最高版本号。高位字节指出副版本(修正)号，低位字节指明主版本号。
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
	af：一个地址描述。目前仅支持AF_INET格式，也就是说ARPA Internet地址格式。
	type：指定socket类型。新套接口的类型描述类型，如TCP（SOCK_STREAM）和UDP（SOCK_DGRAM）。
		常用的socket类型有，SOCK_STREAM、SOCK_DGRAM、SOCK_RAW、SOCK_PACKET、SOCK_SEQPACKET等等。
	protocol：顾名思义，就是指定协议。套接口所用的协议。如调用者不想指定，可用0。
		常用的协议有，IPPROTO_TCP、IPPROTO_UDP、IPPROTO_STCP、IPPROTO_TIPC等，它们分别对应TCP传输协议、UDP传输协议、STCP传输协议、TIPC传输协议。
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
	backlog 连接请求队列(queue of pending connections)
	的最大长度（一般由2到4）。用SOMAXCONN则由
	系统确定
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