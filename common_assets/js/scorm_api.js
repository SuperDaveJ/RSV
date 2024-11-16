var findAPITries = 1;
var API = null;
var exitPageStatus;
var timerID = null;
var timerRunning = false;
var timeValue;
var timecnt=0;
var ret;
var ret1;
var code;
var diag;
var CourseCompletionStatus = 0;
var SetCompletioStatus = true;
//Initialy we kept the Bookmark data as empty.
var Bookmark_location="";
//Mastery score for the course.
var SetMasteryScore=70;

//for print table
var topicName, compObjective, compDescription, LineItem, Area, Reference;
var uScore, qStatus;	//get these from flash
var tableData = [];
var topicName;
var KCpath;
var loadxml = false;



//---------------------------------------------------------------------------------------------------------------------------
function FindAPI(win)
{
   //API will be searched in the current window and the parent frames of this window. Maximum 7 parents will be searched. 
   while ((win.API == null) && (win.parent != null) && (win.parent != win))
   {
      findAPITries++;
      // Note: 7 is an arbitrary number, but should be more than sufficient
      if (findAPITries > 7) 
      {
         parent.status = "Error finding API -- too deeply nested.";
         return null;
      }      
      win = win.parent;
   }
   return win.API;
}
//----------------------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------------------------
function GetAPI()
{
   
   //API will be searched in the current window.
   var API = FindAPI(window);

   //If the API is not found in current indow, then we check for the opener of the current window.
   if ((API == null) && (window.opener != null) && (typeof(window.opener) != "undefined"))
   {
      API = FindAPI(window.opener);	 
   }


   //If the API is not found, this message will be displayed at the status bar of the browser. 
   //Typically you will observe this message on the status bar, if the course is launched from the local system.     
   if (API == null)
   {
     parent.status = "Unable to find an API adapter";
   }

   return API
}
//------------------------------------------------------------------------------------------------------------------------------------








//-------------------------------------------------------------------------------------------------------------------------------------
//This is the first function called on the OnLoad event of the course launching page.
function initSco()
{
	    //Search for the API.
		
		exitPageStatus = false;
		API = GetAPI();
		if( API != null )
		{
			
			//API is found - This is the first call to the LMS. The course can start communication with the LMS after this call.
			API.LMSInitialize("");

			//Start the Timer to measure the current session time.
			startclock();
			
			//Set the Maximum and minimum score for the SCO.
			set_val("cmi.core.score.max",100);
			set_val("cmi.core.score.min",0);
            //Retrieve the Lesson Status from the LMS.
			var status = get_val("cmi.core.lesson_status")

            //If the lesson status found to be "Not Attempted" then this is user's first attempt. Set the status to 'inclomplete'.
			if (status == "not attempted")
			{
			  //the student is now attempting the lesson
			  //This is students first attempt.
			  set_val("cmi.core.lesson_status","incomplete");
			  set_val("cmi.suspend_data","");
			} else if (status == "completed" || status == "failed") {
				CourseCompletionStatus = 1;
			}
			
			//Retrieve the Bookmark data from the LMS.	
			Bookmark_location = get_val("cmi.suspend_data");	
			

			//Check for LMS communication Errors.
			fnCheckErrors();	
		}	
}
//-------------------------------------------------------------------------------------------------------------------------------------





//-------------------------------------------------------------------------------------------------------------------------------------
//This function will be responsible for sending data to the LMS.
function set_val( gname,gvalue )
{
	//Before calling any LMS function, we will always check for the API.
	API = GetAPI();
	if( API != null )
	{
		//LMSSetValue function is called to update data to the LMS.
		//"gname" is LMS variable name, in which we are updating the data, and "gvalue" is the actual value which we are storing in it.
		API.LMSSetValue(gname, gvalue);		

		//Check for LMS communication Errors.
		fnCheckErrors();	
		
		//"commit" function will be called to forcefully update the data to the LMS.
		commit();		
	}	
};
//-------------------------------------------------------------------------------------------------------------------------------------








//-------------------------------------------------------------------------------------------------------------------------------------
//This function will be responsible for retrieving the data from the LMS.
function get_val( gname )
{
	//Before calling any LMS function, we will always check for the API.
	API = GetAPI();
	if( API != null )
	{
		//"LMSGetValue" function will retrive the data from the LMS, for the specified variable. 
		ret1 = API.LMSGetValue(gname);	
		
		//Check for LMS communication Errors.
		fnCheckErrors();
		
		return ret1;				
	}	
};
//-------------------------------------------------------------------------------------------------------------------------------------








//-------------------------------------------------------------------------------------------------------------------------------------
//"commit" function will be called to forcefully update the data to the LMS. 
function commit()
{
	//Before calling any LMS function, we will always check for the API.
	API = GetAPI();
	if( API != null )
	{
		//LMS commit function is called.
		API.LMSCommit("");
				
	}	
};
//-------------------------------------------------------------------------------------------------------------------------------------

function closeWin()
{
	//alert(exitPageStatus)
	if (exitPageStatus != true) {
		API = GetAPI();		
		if( API != null )
		{ 
			set_val( "cmi.core.exit", "" );

   			finish();
   
   			exitPageStatus = true;

		}
	
	}
	window.top.close();
}






//-------------------------------------------------------------------------------------------------------------------------------------
//This is the last function called on the OnUnload/OnBeforeUnload event of the course launching page. After this call we can not execute any other call except the error handling functions.
//After this call communication with the LMS will be terminated.
function finish()
{
		//Before calling any LMS function, we will always check for the API.
		API = GetAPI();		
		if( API != null )
		{
			//Submit Data to the LMS
			//set_val("cmi.suspend_data",Bookmark_location);			
			sTime=stopclock();
			sTime=String(sTime);
			//Submit Tile value to the LMS.
			set_val("cmi.core.session_time",sTime);		
			//call LMS Finish
			ret1 = API.LMSFinish("");
			fnCheckErrors();	
		}	
};

//-------------------------------------------------------------------------------------------------------------------------------------





function fnCheckErrors()
{
	if(API != null)
	{
		//LMSGetLastError will display a error code if there is any error occoured in the communication.
		code = API.LMSGetLastError();
		//LMSGetErrorString will display the error description for that error code.
		ret = API.LMSGetErrorString(code);
		
		//If any Error is occoured, then alert that Error code and description. If the code is "0" then thr is no error.
		if(code != 0)
		{
			alert("ErrorCode: " + code + "    Error Description: " + ret);
		}

		//LMSGetDiagnostic will display the additional information about the error.
		diag = API.LMSGetDiagnostic("");
	}
}




//-------------------------------------------------------------------------------------------------------------------------------------
//Time calculation Functions
function stopclock()
{
	clearTimeout(timerID)
	return timeValue;
}
//-------------------------------------------------------------------------------------------------------------------------------------




//-------------------------------------------------------------------------------------------------------------------------------------
//Time calculation Functions
function startclock()
{	
	showtime();
}

//-------------------------------------------------------------------------------------------------------------------------------------




//-------------------------------------------------------------------------------------------------------------------------------------
//Time calculation Functions
function showtime()
{
	timecnt++;
	var newElapsedTime
	var hours = Math.floor( timecnt / 3600 )
	newElapsedTime = timecnt - (hours*3600)

	var minutes = 	Math.floor( newElapsedTime / 60 )
	newElapsedTime = newElapsedTime - (minutes*60)

	var seconds = newElapsedTime

	timeValue = "" + hours
	if(hours<10)
	{
		timeValue = "0" + hours
	}
	timeValue  += ((minutes < 10) ? ":0" : ":") + minutes
	timeValue  += ((seconds < 10) ? ":0" : ":") + seconds
	// Update display
	timerID = setTimeout("showtime()",1000)
}
//-------------------------------------------------------------------------------------------------------------------------------------



//To set the course completion status
function fnSetCompletionStatus (param)
{
	//if(SetCompletioStatus == false)
//	{
		set_val("cmi.core.lesson_status",param);	
	//	SetCompletioStatus = true;	
//	}
}


//-------------------------------------------------------------------------------------------------------------------------------------
//The Bookmarked data is sent to the course (Flash File) through Query String.
function fnGetBookMark()
{
	//"" //"I,I,C,C,C,C,C,C,C,C,I,C,I,I,I,I,I,I,I,I,I,I,I,I,C,C,C,"
	return Bookmark_location;// "Team Evaluator$50$2100$0,1,0,0,0,1,0,1,0,1,0,0,0,0$1,150|2,0,3,0|4,0|5,750|6,300$0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0$0$0$0" 
}
//-------------------------------------------------------------------------------------------------------------------------------------

function fnGetUnitStatus()
{
	//1 //
	return CourseCompletionStatus;  //0; 
}



//-------------------------------------------------------------------------------------------------------------------------------------
//The Bookmarked data is received from the Flash file
function fnSaveBookmark(setbookmark)
{
	Bookmark_location=setbookmark;	
	set_val('cmi.suspend_data',Bookmark_location);	
}
//-------------------------------------------------------------------------------------------------------------------------------------






//-------------------------------------------------------------------------------------------------------------------------------------
//Retrive Student Name from the LMS
function fnGetStudentName()
{	
	return(get_val("cmi.core.student_name"))
}

//-------------------------------------------------------------------------------------------------------------------------------------




//-------------------------------------------------------------------------------------------------------------------------------------
//Assessment score is updated to the LMS.
function fnSubmitScoreVal(score)
{
	set_val("cmi.core.score.raw",score);
}
//-------------------------------------------------------------------------------------------------------------------------------------


//-------------------------------------------------------------------------------------------------------------------------------------
//Assessment score and the passed/failed status is updated to the LMS, depending on the course Mastery Score.
function fnSetFinalScore(score)
{	
	//set_val("cmi.core.score.raw",score);	
	if(score>=SetMasteryScore)
	{	
		//Send the 'passed' status to the LMS
		set_val("cmi.core.lesson_status","passed");
	}
	else
	{
		//Send the 'failed' status to the LMS
		set_val("cmi.core.lesson_status","failed");	
	}
}
//-------------------------------------------------------------------------------------------------------------------------------------




//open the PDF Documents
function OpenPDFDocuments(param)
{ 
	param = param.split("|");
	var pdfname = param[0];
	var launch = param[1];	
    
    var openWinPDF=window.open(pdfname,launch)    
}

//----------------------------------------------------------------------------------------------------------------------------------------

//print conpatency/student performance table
function printTable() {
	var positionTop = (screen.height - 800)/2 - 25;
	var positionLeft = (screen.width - 960)/2 - 5;
	var newWin = window.open ("../common_assets/Competency_Table.html","Table","toolbar=no,location=no,menubar=no,status=no,resizable=yes,scrollbars=yes,width=960,height=800,top="+positionTop+",left="+positionLeft+"");
	newWin.focus();
}

function showError(jqXHR, textStatus, errorThrown) {
	alert("Error: getting XML data.\n" + textStatus + "\n" + errorThrown); 
	return;
}

function parseXML2(xmlData) {
	var idNew = idOld = "0";
	topic = $(xmlData).find("Topic");
	topicName = $(topic).find("TopicName").text();
	$(topic).find("Page[CompentancyObj]").each( function() {
		idNew = $(this).attr("CompentancyObj");
		if ( idNew != idOld ) {
		  var rowData = {};
		  rowData.obj = $(this).attr("CompentancyText");
		  rowData.desc = $(this).attr("CompentancyDescription");
		  rowData.lineItem = "<ul>" + $(this).find("STS_Line").text() + "</ul>";
		  rowData.area = "<ul>" + $(this).find("RSV_Area").text() + "</ul>";
		  rowData.ref = "<ul>"+ $(this).find("Training_Reference").text() + "</ul>";
		  tableData.push(rowData);
		} else {
			//do nothing
		}
		idOld = idNew;
	});

}

function parseXML1(xmlData) {
	//alert(KCpath)
	//var idNew = idOld = "0";
	if (KCpath==0) topic = $(xmlData).find("Assessment").eq(0);
	else topic = $(xmlData).find("Assessment").eq(1);
	
	//alert(topic.length)
	
	//topic = $(xmlData).find("Assessment");
	topicName = $(xmlData).find("QuizName").text();
	$(topic).find("Question").each( function() {
		//idNew = $(this).attr("CompentancyObj");
		//alert("HI")
		//if ( idNew != idOld ) {
		  var rowData = {};
		  rowData.obj = $(this).attr("CompentancyText");
		  rowData.desc = $(this).attr("CompentancyDescription");
		  rowData.lineItem = "<ul>" + $(this).find("STS_Line").text() + "</ul>";
		  rowData.area = "<ul>" + $(this).find("RSV_Area").text() + "</ul>";
		  rowData.ref = "<ul>"+ $(this).find("Training_Reference").text() + "</ul>";
		  tableData.push(rowData);
		  //i += 1;
		  //alert(i);
		//} else {
			//do nothing
		//}
		//idOld = idNew;
	});

}

function printFromFlash(param) {
	
	KCpath  = param.split("/")[0];
	uScore = param.split("/")[1];
	qStatus = param.split("/")[2];
	//alert("Your score: "+uScore +", Each Q:"+qStatus);

	var xmlpath; 
	var parseXML;
	
	if (coursePath.substr(0,1)=="k") {
		xmlpath = "media/Assessment_Shell.xml";
		parseXML = parseXML1
	} else {
		xmlpath = "course.xml";
		parseXML = parseXML2
	}
	if (!loadxml) {
		loadxml = true;
		$.ajax({
			type: "GET",
	 		url: xmlpath,
	  		dataType: "xml",
			async: false,
	  		success: parseXML,
			error: showError
		});
	}
	
	printTable();
}