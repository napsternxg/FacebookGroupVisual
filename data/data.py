from facepy import GraphAPI
import json

graph = GraphAPI('CAACEdEose0cBAMT8YoUZCfrUJ8uuX1fW6KaWZAWvUfEw9ZCIWkHTMAq3tDAbftyoWPt7zYnwmdDuE7sZCEnvIpvKdjNqGndqh1v0xqdWCf08lwnwX3PZCvFqPVzQoqZB1DdVZBXmVyYLqHoprdPPspDaettFqZB8QaB4R57yAt4HctuNjCM7Hga1nZCJkovU3ZC73QemOq3ZCOhxZAAbmm9bMHMngtplfjdIaswZD')
query = '540171036091887/feed?fields=from,message,caption,likes,comments{from,message,created_time,like_count,comment_count},created_time,id,type&limit=10'
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

