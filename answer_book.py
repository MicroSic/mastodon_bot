import requests
import linecache

max = 350
path = 'Answer_Book.txt'
#修改max的值为Answer_Book.txt的行数

response = requests.get(f"https://www.random.org/integers/?num=1&min=1&max={max}&col=1&base=10&format=plain&rnd=new")
i = int(response.text.strip())
#设置文件对象
line = linecache.getline(path, i).strip()
print(line)
