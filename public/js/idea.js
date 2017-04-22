// JavaScript Document
// Add idea dialog box
		$("#addbtn").click(function(e) {
    		event.preventDefault(e);
      		var title = $("#title").val();
      		var category = $("#category").val();
	    	var description = $("#description").val();
      		var userToken = $("#usertoken").val(); 
      		var time = new Date();  
        	$.post('/addidea/',{title:title,category:category,description:description,usertoken:userToken, time:time}, function(r){
          		alert(r);
		  		window.location ='/idea';
        	});
			$("#formdialog").dialog('close');

    	});
  // Add idea dialog box

  //validating idea dialog box
		function valid() {
			var title = $("#title").val();
    		var category = $("#category").val();
	  		var description = $("#description").val();
				if ((title != " " && category != " ") && (description != " ")) {
						$("#addbtn").removeAttr("disabled");
				}
				else {
						$("#addbtn").attr("disable",true);
				}
			}


		$("#title").blur( function () {
			valid();
		});


		$("#category").change( function () {
			valid();
		});


		$("#description").keypress( function () {
			valid();
		});


		$("#description").blur( function () {
			valid();
		});
  
//validating idea dialog box

//getting ideas
		function getUser(i) {
 			$.post('/getuser',{tok:i},function(res) {
		        var keey = Object.keys(res);
		        var userKey = res[keey];
		        var phone = userKey["phone"];
		        var name = userKey["username"];
		        document.getElementById('userd').innerHTML = name;
      		});
	
		}

		getUser(i);

	  	function getIdeas() {
			$.post('/getideas',{},function(res) {
				var cont = "";
				var objectKeys = Object.keys(res);
				var objectLength = objectKeys.length;
				var v = 1;
				for (a =0; a < objectLength; a++) {
					var b = objectKeys[a];
					cont = res[b];
					var title = cont.title;
					var date = cont.date;
					var upv = cont.upvote;
					var downv = cont.downvote;
					var desc =cont.description;
				  	var desc = markDown(desc);
					var cat = cont.category;
					var dataToDisplay = "";
					var author ="";
					Object.keys(cont).forEach(function(key) {
					if(key == "comment") {
						data = cont[key];
						dataKey = Object.keys(data);
						dataKeyLength = dataKey.length;
						if (dataKeyLength <=1) {
							//console.log(data);
							var singleKey = Object.keys(data);
							//console.log(singleKey);
							console.log(data[singleKey]);
							var splitedData = data[singleKey];
							//dataToDisplay = "Single";	
							dataToDisplay = "<h4 class='commentbody'>" + splitedData.comment; + "</h4><h5>"+ splitedData.commenter; +",<br/> "+splitedData.time;  +"</5></br>";
						}
						else {
							for(commentId in data) {
								var splitedData = data[commentId];
								var comment = splitedData.comment;
								var commenter = splitedData.commenter;
								var commentTime = splitedData.time; 
								dataToDisplay += "<h4 class='commentbody'>" + comment + "</h4><h5 class='commentdetails'>"+ commenter +",<br/> "+commentTime +"</h5></br>";	
							}
						}
					}
					else if (key == 'userid') {
						var id = cont[key];
						$.post('/ideaposter',{tok:id},function(res) {
						var keey = Object.keys(res);
						var userKey = res[keey];
						var phone = userKey["phone"];
						name = userKey["username"];	
						return name
								;
				  		});
					}
				});
		      		var display = "<div class='ideacont' style=''><h3 class='ideatitle'>" +title+ "</h3><div class='well well-sm ideadesc'>"+desc+ "</div><h5 class='ideadetails'>"+" by "+ name +"<br> category: "+cat+ ", </br> at: "+date +"</h5><div><button class='btn-sm btn-success ideauvote' onclick='upvote("+v+","+upv+")' >Upvotes "+ upv+ "</button>&nbsp;<button class='btn-sm btn-warning ideadvote' onclick='downvote("+v+","+downv+")'id='dwv"+v+"'>Downvotes "+ downv+ "</button></div><div class='ideacomment'> <h4 class='commenttitle'>Comments:</h4>"+dataToDisplay+"</div><div class='newcomment'><textarea class='form-control' id='addcomm"+v+"'></textarea><br><button class='btn-sm btn-warning' onclick='addComment("+v+")' >Add Comment</button></div></div><input type='hidden' value='"+b+"' id='ideaid"+v+"'"+ b;
		        	document.getElementById('displayIdeas').innerHTML += display +"<br>";
					comm = " ";
					v++;	
				}
      		});
	  	}


	  	getIdeas();


	  	function upvote(a,b) {
			var ideaId = $("#ideaid"+a).val();
			b +=1;
	  		$.post('/vote',{v:'up',ideaId:ideaId,vote:b},function(r) {
		 		// alert(r);
		  		if(r =="voted"){
			 		window.location = '/idea'; 
		  		}
		  	});
	  	};


	  	function downvote(a,b) {
			 var ideaId = $("#ideaid"+a).val();
		 	b +=1
	  	 	$.post('/vote',{v:'down',ideaId:ideaId,vote:b},function(r) {
			 	//alert(r);
			 	window.location = '/idea'; 
		 	});
	  	};


//function to add Comment
 		function addComment(v) { 
	 		var comment = $("#addcomm"+v).val();
	 		if (comment == "") {
			alert ("Please Fill your comment") ;
	 		}
	 		else{
				var ideaId = $("#ideaid"+v).val();
				var commenter = document.getElementById('userd').innerHTML;
				var date = new Date();
				 $.post('/addcomment', {comment:comment,ideaId:ideaId,date:date,commenter:commenter},function(res) {
					alert (res);
					window.location='/idea';
				});
	 
	 		}
 		}


 		function markDown(txt) {
  			var markedWord =  markdown.toHTML(txt);
  			return markedWord;
		}
	
