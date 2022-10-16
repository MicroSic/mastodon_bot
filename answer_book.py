import sys
import requests
import io
import linecache
sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding = 'utf-8')

return_string = ''
path = 'Answer_Book.txt'
#修改max的值为Answer_Book.txt的行数
max="10"
response = requests.get("https://www.random.org/integers/?num=1&min=1&max="+max+"&col=1&base=10&format=plain&rnd=new")
x=response.text

f = open(path,"r",encoding='UTF-8')   #设置文件对象
i=int(x)
content=linecache.getline(path, i)
f.close() #关闭文件

print(content)
