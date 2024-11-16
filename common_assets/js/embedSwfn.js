function fnEmbedSwf(param)
{		
	document.write("<HTML><HEAD><meta http-equiv=Content-Type content=text/html;  charset=ISO-8859-1\"><TITLE>Air Force Medical Support Agency RSV Tool</TITLE>");

	document.write("<scr");
	document.write("ipt language=\"javascript\">initSco();</scr");
	document.write("ipt>");

	document.write("</HEAD><BODY bgcolor=\"#000000\" leftmargin=\"0\" topmargin=\"0\" marginwidth=\"0\" marginheight=\"0\"><div style=\"text-align:center;\"><object classid=\"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000\" width=\"1002\" height=\"580\" id=\"Shell_C2\" align=\"middle\"><param name=\"movie\" value=\"../common_assets/Shell_C2.swf\" /> <param name=\"allowScriptAccess\" value=\"sameDomain\" /><param name=\"FlashVars\" value=\"BookMark_data="+fnGetBookMark() +"&unit_status="+fnGetUnitStatus()+ "&student_name="+fnGetStudentName()+"&CurrentLauchModule="+param+"\" /><PARAM NAME=quality VALUE=high><param name=\"bgcolor\" value=\"#000000\" /><param name=\"wmode\" value=\"transparent\" /><object type=\"application/x-shockwave-flash\" data=\"../common_assets/Shell_C2.swf\" width=\"1002\" height=\"580\"><param name=\"movie\" value=\"../common_assets/Shell_C2.swf\" /><param name=\"FlashVars\" value=\"BookMark_data="+fnGetBookMark() + "&unit_status="+fnGetUnitStatus() + "&student_name="+fnGetStudentName()+"&CurrentLauchModule="+param+"\" /><param name=\"quality\" value=\"high\" /><param name=\"allowScriptAccess\" value=\"sameDomain\" /><param name=\"bgcolor\" value=\"#000000\" /><param name=\"wmode\" value=\"transparent\" /></OBJECT></div></BODY></HTML>");
}