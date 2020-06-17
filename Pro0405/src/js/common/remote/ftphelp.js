
function FtpHelp(element){
	
	var obj = element;
	
	/**
	 * 初始化
	 */
	this.init = function(){
		this.postCommand(1, '');
	};
	
	/***
	 * 逆初始化
	 */
	this.unInit = function(){
		this.postCommand(2, '');
	};

	/**
	 * 上传
	 */
	this.upload = function(json){
		return this.postCommand(3, json);
	};
	
	/**
	 * 取消上传
	 */
	this.cancelUpload = function() { 
		return obj.PostCommand(4, '');
	};
	
	/**
	 * 通用操作接口
	 * @param cmd 操作类型　１初始化　２逆初始化　　３上传文件或者文件夹　　　４撤销当前上传任务
	 */
	this.postCommand = function(cmd, json){
		var errCode = obj.PostCommand(cmd, json);
		this.checkErr(errCode);
		return errCode;
	};
	
	
	this.checkErr = function(errCode){
		if(errCode > 0){
			alert(FtpEror[errCode].desc);
		}
	};
	
	/**
	 * 注册通知事件
	 */
	this.registEvent = function(listener){
		//
		//var script = document.createElement("script");
		//script.language = "javascript";
		//script.setAttribute("for", obj.id);
		//script.setAttribute("event", listener);
		//document.body.appendChild(script);

	};
	
}


function UploadParam(){
	this.srcpath = null;
	this.dstpath = null;
	this.dstfile = null;
	this.ftpip = null;
	this.ftpport = 21;
	this.ftpusr = null;
	this.ftppass = null;
	this.usedata = 1;
}

//插件错误错及错误描述
var FtpEror = [
//		emErrorOk = 0,				//返回正确
//		emErrorNotSupport = 1,		//功能不支持
//		emErrorKillEd = 2,			//被终止
//		emErrorDoing = 3,			//任务正在执行
//		emErrorJson = 4,			//JSON结构错误
//		emErrorNew = 5,				//New错误
//		emErrorFtp = 6,				//FTP操作错误
	{err:0, desc : '返回正确'},
	{err:1, desc : '功能不支持'},
	{err:2, desc : '被终止'},
	{err:3, desc : '任务正在执行'},
	{err:4, desc : 'JSON结构错误'},
	{err:5, desc : 'New错误'},
	{err:6, desc : 'FTP操作错误'}
];