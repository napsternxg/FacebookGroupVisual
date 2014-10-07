We - Facebook Group Visualization
===================

Name: We - Facebook Group Visualization
Link: http://shubhanshu.com/FacebookGroupVisual/index.html

Abstract
---------
‘We’ is a tool used visualize a user’s facebook group interaction by plotting all conversations that happen on a group. We use markers like number of comments, and number of likes, all displayed along a timeline.

Objective
-----------
Find the hidden dynamics in group conversations. In different types of groups, different kinds of posts triggers activity among the members. For ex, in CS 467 FB group we can see a lot of activity clustered in and around the dates of submission.

Steps to Visualization:
-----------------------
1. Got to the website which asks the user to provide his Facebook login credentials
2. Using the credentials we provide the user with a list of the groups he/she is currently a member of.
3. The user can choose the group they wants to visualize by scrolling through the drop down menu and selecting one.
4. The user can then click on the Visualize button which transitions them to the visualization.

Elements of the Visualization:
-------------------------------
- **Posts:** These can be of the following 4 types and represented by the circles above the bottom line. Every post can have multiple comments. The size of the post  is proportional to the number of comments it has. The height of the post is proportional to the number of likes the post has. 
	- **Post status:** These represent the posts in the group which are text only.
	- **Post others:** These represent the posts in the group which are NOT text only.
	- **Post highlight status:** These represent the posts in the group highlighted by the user which are text only.
	- **Post highlight others:** These represent the posts in the group highlighted by the user which are NOT text only.
- **Comments:** These can be of 2 types and are represented by the circles on the bottom line. Every comment is a part of a post. The size of comment is proportional to the number of likes it has. 
- **Comment status:** These represent the comments in the group.
- **Comment highlight status:** These represent the comments in the group highlighted by the user.
- **The Hover effect:** On hovering over a circle we see the relation that post/comment has with other posts/comments. We also see a the post/comment author and the full text. 
- **The Click effect:** On clicking on a post we see a threaded view of the post and its comments with the number of likes mentioned next to each of them in the bottom pane. 
- **Legends:** The visualization has legends on the side to help in understanding the color mapping to various chart objects. 
- **Switches:** The visualization has some switches which allow the user to switch on/off the showing of important dates and posts by important individuals (both values prespecified for CS 467 FA group). 
- **Time Slider:** At the bottom is a line chart with the overall activity on the group. This slider has height of points proportional to the number of comments on each post. If you DRAW over this line chart you will see a small rectangle which will help you in focussing on the data in that time slice. You can stretch and pan this slider to observe different part of the dataset. 

Interaction
---------------
- We have used a Facebook Application to get access to the user’s data and use the facebook login button etc.
- Once the user has logged in, we use facebook api function to query the user’s list of groups and dynamically populate the drop down box.
- The user makes a selection from the dropdown box and the groups ID is used to retrieve more specific data about the group like comments, like, dates etc.
- With all this data, we input it into our d3 visualization, and display the circles based on the aggregation counts of comments and likes.
- Visual effects like hovering shows snippets of the post are also added.
- There are 2 toggles buttons below which allow the user to turn on the display for dates on the timeline.
- We have information on demand feature where the user can see the entire conversation by clicking each comment bubble.

Tools and Libraries
--------------------
- D3.js
- jQuery
- Twitter Bootstrap
- D3.tip
- D3.legend
- Agency Bootstrap theme

Acknowledgement
---------------
We like to extend our sincere gratitude to Karrie and her team for all the help and support they have offered during the nascent stages of this project. We also like to thank our classmates to have taken the time to carefully critique our designs and provide us with constructive criticism so that we could improve on our designs.   


