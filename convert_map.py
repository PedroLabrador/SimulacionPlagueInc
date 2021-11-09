import json

rows = []

with open("test.o", "r") as file:
    for line in file:
        columns = []
        for char in line:
            columns.append(char)
        rows.append(columns)

with open("map.json", "w") as file:
    json.dump(rows, file)