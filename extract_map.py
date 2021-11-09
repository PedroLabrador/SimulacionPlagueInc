from PIL import Image

im = Image.open('map_black_small.jpg')
pix = im.load()
width, height = im.size

print(pix[0,0])

with open("test.o", "w") as file:
    for y in range(height):
        line = ""
        for x in range(width):
            r, g, b = pix[x,y]
            if (r < 160 and g < 160 and b < 160) or (r > 215 and g > 215 and b > 215):
                line = line + 'o'
                # print('o', end="")
            else:
                line = line + ' '
                # print(' ', end="")
        file.write(line + "\n")
        # print("")


n = "northamerica"
s = "southamerica"
e = "europe"
a = "asia"
f = "africa"
o = "oceania"

