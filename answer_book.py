import sys
import requests
import io
import linecache
sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding = 'utf-8')

return_string = ''
path = 'Answer_Book.txt'

response = requests.get("https://www.random.org/integers/?num=1&min=1&max="+max+"&col=1&base=10&format=plain&rnd=new")
x=response.text

f = open(path,"r",encoding='UTF-8')   #设置文件对象
i = x-"\n"
i=int(i)
content=linecache.getline(path, i)
f.close() #关闭文件

print(content)
