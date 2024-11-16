stop();
// if required
_parent.mcLoading.fnShow();
this._visible = false;
dtxt_title._visible = 0;
dataXML = new XML();
var j = 0;
var tab_cnt = 0;
var transcriptArray=new Array();
dataXML.ignoreWhite = true;
dataXML.load(get_XML_File_Name_fn());
dataXML.onLoad = fnParseData;
function fnParseData(success) {
	//trace("dataXML.childNodes[0]: "+dataXML.childNodes[0].nodeName)
	if(success)
	{
		var firstcld = dataXML.childNodes[0].childNodes;
		fnAssignData(firstcld);
	}
}
function fnTranscriptCheck(transcript_text)
{
	//if(transcriptFlag)
	//{
		var l_TranscriptText = _parent.gArrPageInfo[_parent.gCurrentPageNum].TranscriptText;
		if (l_TranscriptText == "#") {
			_parent.mcTranscript.fnEnable("No");
		} else {
			_parent.mcTranscript.fnEnable("Yes");
			_parent.mcTranscript.fnSetTranscriptText(transcript_text);
			//trace("transcript_text: " + transcript_text);

		}
	//}
}
function fnAssignData(childData) {
	var j = 0;
	var l = 1;
	counter=0;
	dtxt_title._visible = 0;
	for (var i = 0; i<childData.length; i++) 
	{
		if(childData[i].nodeName == "transcript_text")
		{
				this["transcript_text"+counter] = childData[i].childNodes[0].nodeValue;
				transcriptArray[counter]=childData[i].childNodes[0].nodeValue;	
				counter++;
		}
		else
		{
			this[childData[i].nodeName] = childData[i].childNodes[0].nodeValue;
			j++;
		}
	}
	for (var i = 0; i<childData.length; i++) 
	{
		//trace("text"+i+": "+ eval("text"+i));
		
	}
	fnTranscriptCheck(transcript_text0);
	this._visible = true;
	_parent.mcLoading.fnHide();
	play();
}
