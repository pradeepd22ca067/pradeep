def missing(missing,st_list):
    for  i in missing:
        for j in st_list:
            if (j  == i):
                st_list.remove(i)
    return st_list

def run(el_list,ec_list,it_list,subject_code):
    el = len(el_list)
    ec = len(ec_list)
    it = len(it_list)
    temp_matrix =[]
    while ( it_list != [] or el_list != [] or ec_list != [] ):
        if (it == ec == el):
             temp_matrix.append((ec_list.pop(0), subject_code) if ec_list else None)
             temp_matrix.append((el_list.pop(0), subject_code) if el_list else None)
             temp_matrix.append((it_list.pop(0), subject_code) if it_list else None)
        elif el >= ec and el > it:
            if ec > it:
                if it_list:
                    temp_matrix.append((el_list.pop(0), subject_code) if el_list else None)
                    temp_matrix.append((ec_list.pop(0), subject_code) if ec_list else None)
                    temp_matrix.append((it_list.pop(0), subject_code) if it_list else None)
                elif ec_list:
                    temp_matrix.append((el_list.pop(0), subject_code) if el_list else None)
                    temp_matrix.append((ec_list.pop(0), subject_code) if ec_list else None)
                elif el_list:
                    temp_matrix.append((el_list.pop(0), subject_code) if el_list else None)
                    temp_matrix.append((it_list.pop(0), subject_code) if it_list else None)
            elif it > ec:
                if ec_list:
                    temp_matrix.append((el_list.pop(0), subject_code) if el_list else None)
                    temp_matrix.append((ec_list.pop(0), subject_code) if ec_list else None)
                    temp_matrix.append((it_list.pop(0), subject_code) if it_list else None)
                elif it_list:
                    temp_matrix.append((el_list.pop(0), subject_code) if el_list else None)
                    temp_matrix.append((it_list.pop(0), subject_code) if it_list else None)
                elif el_list:
                    temp_matrix.append((el_list.pop(0), subject_code) if el_list else None)
                    temp_matrix.append((ec_list.pop(0), subject_code) if ec_list else None)
        elif ec >= it and ec > el:
            if el > it:
                if it_list:
                    temp_matrix.append((el_list.pop(0), subject_code) if el_list else None)
                    temp_matrix.append((ec_list.pop(0), subject_code) if ec_list else None)
                    temp_matrix.append((it_list.pop(0), subject_code) if it_list else None)
                elif el_list:
                    temp_matrix.append((el_list.pop(0), subject_code) if el_list else None)
                    temp_matrix.append((ec_list.pop(0), subject_code) if ec_list else None)
                elif ec_list:
                    temp_matrix.append((el_list.pop(0), subject_code) if el_list else None)
                    temp_matrix.append((ec_list.pop(0), subject_code) if ec_list else None)
            elif it > el:
                if el_list:
                    temp_matrix.append((el_list.pop(0), subject_code) if el_list else None)
                    temp_matrix.append((ec_list.pop(0), subject_code) if ec_list else None)
                    temp_matrix.append((it_list.pop(0), subject_code) if it_list else None)
                elif it_list:
                    temp_matrix.append((it_list.pop(0), subject_code) if it_list else None)
                    temp_matrix.append((ec_list.pop(0), subject_code) if ec_list else None)
                elif ec_list:
                    temp_matrix.append((el_list.pop(0), subject_code) if el_list else None)
                    temp_matrix.append((ec_list.pop(0), subject_code) if ec_list else None)
        elif it >= el and it > ec:
            if ec > el:
                if el_list:
                    temp_matrix.append((el_list.pop(0), subject_code) if el_list else None)
                    temp_matrix.append((ec_list.pop(0), subject_code) if ec_list else None)
                    temp_matrix.append((it_list.pop(0), subject_code) if it_list else None)
                elif ec_list:
                    temp_matrix.append((ec_list.pop(0), subject_code) if ec_list else None)
                    temp_matrix.append((it_list.pop(0), subject_code) if it_list else None)
                elif it_list:
                    temp_matrix.append((el_list.pop(0), subject_code) if el_list else None)
                    temp_matrix.append((it_list.pop(0), subject_code) if it_list else None)
            elif el > ec:
                if ec_list:
                    temp_matrix.append((it_list.pop(0), subject_code) if it_list else None)
                    temp_matrix.append((el_list.pop(0), subject_code) if el_list else None)
                    temp_matrix.append((ec_list.pop(0), subject_code) if ec_list else None)
                elif el_list:
                    temp_matrix.append((it_list.pop(0), subject_code) if it_list else None)
                    temp_matrix.append((el_list.pop(0), subject_code) if el_list else None)
                elif it_list:
                    temp_matrix.append((it_list.pop(0), subject_code) if it_list else None)
                    temp_matrix.append((el_list.pop(0), subject_code) if el_list else None)

    return temp_matrix

def transpose(temp_matrix,row, col):
    matrix=[]
    for i in range(row):# A for loop for row entries 
        a =[str(temp_matrix.pop(0)) for _ in range(col)]
        matrix.append(a)
        transposed=[[matrix[i][j] for i in range(row)] for j in range(col)]
       
    return transposed

import pandas as pd
def write(result,room_no,subject_code):
    print("result shape:",len(result),"x",len(result[0]))
    writer = pd.ExcelWriter('static/excel/{room_no}_{subject_code}.xlsx', engine='xlsxwriter')
    df = pd.DataFrame(result)
    print(df.head())
    df.to_excel(writer, sheet_name=str(room_no),header=None,index=False)
    writer.save()

def read(room_no,subject_code):
    file_path=f'static/excel/{room_no}_{subject_code}.xlsx'
    temp = pd.read_excel('static/excel/{room_no}.xlsx',header=None,index_col=False).astype(str)
    return temp

