from facepy import GraphAPI
import json

"""
Uses facebook graph api.
Use the console at:
https://developers.facebook.com/tools/explorer/145634995501895/?method=GET&path=540171036091887%2Ffeed%3Ffields%3Dfrom%2Cmessage%2Ccaption%2Clikes%2Ccomments%7Bfrom%2Cmessage%2Ccreated_time%2Clike_count%2Ccomment_count%7D%2Ccreated_time%2Cid%2Ctype%26limit%3D10&version=v2.1
CS467 Group ID: 540171036091887
Free and for Sale UIUC: 210988282360806
"""

access_token = None # replace with your access token from facebook graph api.
if access_token is None:
    with open('access_token.txt') as fp:
        access_token = fp.read()
print "Using access token: ", access_token
graph = GraphAPI(access_token)
query = '540171036091887/feed?fields=from,message,caption,likes,comments{from,message,created_time,like_count,comment_count},created_time,id,type'
group = graph.get(query, page=True)

posts = []
def cleanData(data):
    for i in range(len(data)):
        if 'caption' in data[i]:
            data[i]['type'] = 'link'
        if 'caption' not in data[i]:
            data[i]['caption'] = ''
        if 'comments' not in data[i]:
            data[i]['comments'] = []
        if 'likes' not in data[i]:
            data[i]['likes'] = []
    return data
        
for data in group:
    print len(data['data'])
    posts.extend(cleanData(data['data']))

print "Length of data: ",len(posts)
print posts[0]

with open('data.json', 'wb+') as fp:
	json.dump(posts, fp)

