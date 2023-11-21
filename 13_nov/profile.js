<!DOCTYPE html>
<html lang="en">
<head>
    <title>Document</title>
</head>
<body>
    <h1>welcome  <%= user.name  %></h1>
    <h1>welcome  <%= user.gmail  %></h1>
    <h1>welcome  <%= user.city  %></h1>

    <ol type="a">
        <% user.skills.forEach((item)=>{
            %><li><%=item%></li><%
        })%> 
        
    </ol>
</body>
</html>