let btn= document.getElementById('btn');
let colors=["red","blue","orange","yellow"];
let i=0;
function changecolor()
{
    let const=document.getElementById('container')
    const.style.background=colors[i];
    i++;
}