#include <stdio.h>

#ifdef WIN32
#include <WinSock2.h>
#pragma comment(lib, "WS2_32.lib")
#else
#endif

int main(int argc, char *argv[])
{
	int ret = 0;
#ifdef WIN32
	WSADATA data;
	if(WSAStartup(MAKEWORD(1,1), &data) != 0)
	{
		printf("WSAStartup failed!(%d)", WSAGetLastError());
		ret = -1;
		goto FAILED;
	}
#endif

	SOCKET sock = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
	if(INVALID_SOCKET == sock)
	{
		printf("socket failed!(%d)", WSAGetLastError());
		ret = -2;
		goto FAILED;
	}

	int val = 1;
	setsockopt(sock, SOL_SOCKET, SO_REUSEADDR, reinterpret_cast<const char*>(&val), sizeof(val));

	//可以不调用bind，由系统指定
	//inet_pton
#ifdef WIN32
	SOCKADDR_IN addr;
	addr.sin_addr.S_un.S_addr = inet_addr("127.0.0.1");
	addr.sin_family = AF_INET;
	addr.sin_port = htons(50014);
	if(SOCKET_ERROR == bind(sock, reinterpret_cast<LPSOCKADDR>(&addr), sizeof(addr)))
	{
		printf("bind failed!(%d)", WSAGetLastError());
		ret = -3;
		goto FAILED;
	}
#else
#endif

	addr.sin_port = htons(50012);
	if(0 != connect(sock, reinterpret_cast<LPSOCKADDR>(&addr), sizeof(addr)))
	{
		printf("connect failed!(%d)", WSAGetLastError());
		ret = -4;
		goto FAILED;
	}

	char buf[1024] = "123456789";
	int sendNum = send(sock, buf, strlen(buf), 0);
	if(sendNum < 0)
	{
		printf("send failed!(%d)", WSAGetLastError());
		ret = -5;
		goto FAILED;
	}

	while(true)
	{
		timeval time = {2, 0};
		fd_set fds;
		FD_ZERO(&fds);
		FD_SET(sock, &fds);
		int rr = select(FD_SETSIZE, &fds, NULL, NULL, &time);
		if(rr > 0 && FD_ISSET(sock, &fds))
		{
			int readNum = recv(sock, buf, sizeof(buf), 0);
			printf("client recv buf(%s)", buf);
			goto SUCCESS;
		}
		else if(rr < 0)
		{
			printf("recv failed!(%d)", WSAGetLastError());
			ret = -6;
			goto FAILED;
		}
		else
		{
			puts("client selecting...");
			continue;
		}
	}


SUCCESS:
FAILED:
#ifdef WIN32
	closesocket(sock);
	WSACleanup();
#else
#endif

	getchar();
	return ret;
}