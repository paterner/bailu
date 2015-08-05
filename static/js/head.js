window.onload = function()
{
    var head = document.getElementById("head");	
	var box = document.getElementById("box");	
	var timer;
	head.onmouseover = box.onmouseover = function()
	{
		clearInterval(timer);
		setTimeout(function()
		{
	        box.style.display = "block";	
		},300)
	}
	head.onmouseout = box.onmouseout = function()
	{
		clearInterval(timer);
	    timer = setTimeout(function()
		{
	        box.style.display = "none";	
		},300)
	}
}