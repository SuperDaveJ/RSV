/*
--------------------------------------------
FUNCTION TO GET THE NAME OF THE .XML TO LOAD
--------------------------------------------
*/
function get_XML_File_Name_fn ()
{
	var myXMLFile = "";
	if (_parent.txtpageInfo == undefined)
	{
		//trace ("if Condition");
		//getURL("javascript:alert('this is undefined"+_parent.txtpageInfo.text+"')");
		//trace ("this is undefined=" + _parent.txtpageInfo);
		// get the url of the file
		var myFileURL_str = this._url;
		// start position of the file name
		var startFrom = myFileURL_str.lastIndexOf ("/") + 1;
		// end position of the file name
		var endAt = myFileURL_str.lastIndexOf (".") - startFrom;
		// name of the file
		var myFileName_str = unescape (myFileURL_str.substr (startFrom, endAt));
		nav1path = myFileName_str + ".xml";
		//trace ("nav1path=" + nav1path);
		// path to get the .xml file
		return myFileName_str + ".xml";
	}
	else
	{
		//trace ("else Condition");
		//trace ("this is defined=" + _parent.txtpageInfo);
		var myFileURL_str = _parent.txtpageInfo;
		//	getURL("javascript:alert('this is else:"+myFileURL_str+"')");
		// start position of the file name
		//trace ("myFileURL_str:" + myFileURL_str);
		var startFrom = myFileURL_str.lastIndexOf ("/") + 1;
		// end position of the file name
		var endAt = myFileURL_str.lastIndexOf (".") - startFrom;
		// name of the file
		var myFileName_str = unescape (myFileURL_str.substr (startFrom, endAt));
		nav1path = myFileName_str + ".xml";
		//trace (" nav1path= " + nav1path);
		// path to get the .xml file
		//	return "media/" +myFileName_str + ".xml"; 
		return "../" + _parent.CurrentLauchModule + "/media/" + myFileName_str + ".xml";
	}
}
// end of fn get_XML_File_Name_fn
