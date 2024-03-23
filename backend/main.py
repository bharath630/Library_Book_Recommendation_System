from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import warnings
from sklearn.feature_extraction.text import CountVectorizer
warnings.filterwarnings("ignore")

app=FastAPI()

# Data Reading and Merging
Books=pd.read_csv("D:\Interviews\College Project\Books_dataset\Books.csv",low_memory=False)
Ratings = pd.read_csv("D:\Interviews\College Project\Books_dataset\Ratings.csv",low_memory=False)
Books_with_rating=Ratings.merge(Books,on="ISBN")

origins = [
    "http://localhost:3000",
    "localhost:3000"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

#1 Popular Books based on Avg rating 

Book_Rating=Books_with_rating.groupby('Book-Title').count()['Book-Rating'].reset_index()
Book_Rating.rename(columns={'Book-Rating':'No-of-Ratings'},inplace=True)
    
    #Calculate Avg Rating for a individual book

Book_Avg_Rating=Books_with_rating.groupby('Book-Title').mean(numeric_only=True)['Book-Rating'].reset_index()

Book_Avg_Rating.rename(columns={'Book-Rating':'Avg-Rating'},inplace=True)
Popular_books=Book_Avg_Rating.merge(Book_Rating,on="Book-Title")
    
    # get most rated books by sorting books based on Avg Rating

popular_books=Popular_books[Popular_books['No-of-Ratings']>200].sort_values(by="Avg-Rating",ascending=False).head(50)

    

pop=popular_books.head()

#2  Collaborative filtering


# To get user-id whose no of book ratings is greater than 150
user_id=Books_with_rating.groupby('User-ID').count()['Book-Rating']>150

# users with given no of ratings greater than 150
user_with_rating=user_id[user_id].index

filtered_user_with_rating=Books_with_rating[Books_with_rating['User-ID'] .isin(user_with_rating)]



# books with no of ratings greater than 40

good_books=filtered_user_with_rating.groupby('Book-Title').count()['Book-Rating']>40
# books with no of ratings grater than 40
true_good_books=good_books[good_books].index

final_books=Books_with_rating[Books_with_rating['Book-Title'] .isin(true_good_books)]

col_books=final_books.head()

#3 Content Based Filtering based Author,Year of Publication,Publisher

temp= final_books.drop_duplicates('Book-Title')

content_filter_books=temp[['Book-Title','Book-Author',"Publisher","Year-Of-Publication"]]
#print(content_filter_books.head())

# Removing Spaces to use words for count Vectorizer


def remove_space(st):
    ans=''
    for i in st:
        if(i!=' '):
            ans=ans+i
    return ans

content_filter_books['Book-Author']=content_filter_books['Book-Author'].apply(remove_space)
content_filter_books['Publisher']=content_filter_books['Publisher'].apply(remove_space)
content_filter_books['Year-Of-Publication']=content_filter_books['Year-Of-Publication'].apply(lambda x:str(x).strip())

# concate words then make a tag Column

content_filter_books['Tags']=content_filter_books['Book-Author']+','+content_filter_books['Publisher']+','+content_filter_books['Year-Of-Publication']


# import countvectorizer
vec = CountVectorizer(max_features=10000)

vector = (vec.fit_transform(content_filter_books["Tags"])).toarray()

# import cosine similarity to check similarity of vectors
similarity_content = cosine_similarity(vector)




result=[]
for ind1 in pop.index:
    
    my_dict={}
    for ind2 in Books.index:
        if(pop['Book-Title'][ind1]==Books['Book-Title'][ind2]):
            my_dict['Title']=str(pop['Book-Title'][ind1])
            my_dict['ISBN']=str(Books['ISBN'][ind2])
            my_dict['Author'] = str(Books['Book-Author'][ind2])
            my_dict['Year'] = str(Books['Year-Of-Publication'][ind2])
            my_dict['Publisher'] = str(Books['Publisher'][ind2])
            my_dict['Image-url'] = str(Books['Image-URL-L'][ind2])
            my_dict['Ratings'] = str(pop['No-of-Ratings'][ind1])
            my_dict['Avg_rating'] = str(pop['Avg-Rating'][ind1])
            break
    result.append(my_dict)
    
user_books=[]
for ind1 in col_books.index:
    
    my_dict={}
    for ind2 in Books.index:
        if(col_books['Book-Title'][ind1]==Books['Book-Title'][ind2]):
            my_dict['Title']=str(col_books['Book-Title'][ind1])
            my_dict['ISBN']=str(Books['ISBN'][ind2])
            my_dict['Author'] = str(Books['Book-Author'][ind2])
            my_dict['Year'] = str(Books['Year-Of-Publication'][ind2])
            my_dict['Publisher'] = str(Books['Publisher'][ind2])
            my_dict['Image-url'] = str(Books['Image-URL-L'][ind2])
            my_dict['User-id']=str(col_books['User-ID'])
            break
    user_books.append(my_dict)

@app.get("/popular_books")
async def root():
    return result

@app.post("/searched_books")
async def root1(data:dict):
    def recommend_content_filter(book_name):
        index = content_filter_books[content_filter_books["Book-Title"].str.startswith(book_name)].index[0]
        distances = sorted(list(enumerate(similarity_content[index])),reverse=True,key = lambda x: x[1])
        books_recommended =[]
        for i in distances[1:9]:
            books_recommended.append(content_filter_books.iloc[i[0]]["Book-Title"])
        return books_recommended
    arr=recommend_content_filter(data['val'])
    
    content_books=[]
    for i in arr:
        my_dict={}
        for ind in final_books.index:
            if(i==final_books['Book-Title'][ind]):
                my_dict['Title']=str(final_books['Book-Title'][ind])
                my_dict['ISBN']=str(final_books['ISBN'][ind])
                my_dict['Author'] = str(final_books['Book-Author'][ind])
                my_dict['Year'] = str(final_books['Year-Of-Publication'][ind])
                my_dict['Publisher'] = str(final_books['Publisher'][ind])
                my_dict['Image-url'] = str(final_books['Image-URL-L'][ind])
                my_dict['Ratings'] = str(final_books['Book-Rating'][ind])
                break
        content_books.append(my_dict)
    return content_books    
                
    

@app.get('/users_books')
async def root2():
    return user_books








