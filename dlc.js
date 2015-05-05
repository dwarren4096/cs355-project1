var cxn		= require('./connection.js');
var mysql	= require('mysql');

module.exports = {
	add: function(req, res) {
		var rGameID = parseInt(req.query.GameID);
		var responseHTML = cxn.HTMLHeader + '<h1>Adding DLC for GameID '+rGameID+'</h1>\n\
			<form action="/dlc/insert" method="post">\n\
			<input type="hidden" name="GameID" value="'+rGameID+'" />\n\
			DLCName: <input name="DLCName" type="text" /><br />\n\
			DLCPrice: $<input name="DLCPrice" type="text" /><br />\n\
			DLCReleaseDate: <input name="DLCReleaseDate" type="text" /><br />\n\
			<input type="submit" value="Submit" />\n\
			</form>\n' + cxn.HTMLFooter;
		res.send(responseHTML);
	},

	insert: function(req, res) {
		var rGameID = parseInt(req.body.GameID);
		var qry = 'INSERT INTO DLC SET ?'
		cxn.connection.query(mysql.format(qry, req.body), function(err, result) {
			if (err) {cxn.handleError(res, err);}
			else {
				var responseHTML = cxn.HTMLHeader + '<p>Added '+req.body.DLCName+' DLC to GameID '+rGameID+'</p>\n\
					<p><a href="/dlc/add?GameID="'+rGameID+'">Add more DLC to this game</a><br />\n\
					<a href="/games/view?GameID="'+rGameID+'">Back to game info</a></p>\n'+
					cxn.HTMLFooter;
			}
		});
	},

	edit: function(req, res) {
		var rGameID = parseInt(req.query.GameID);
		var rDLCName = req.query.DLCName;
		var qry = mysql.format('SELECT * FROM DLC WHERE GameID=? AND DLCName=?', [rGameID, rDLCName]);
		cxn.connection.query(qry, function(err, result) {
			if (err) {cxn.handleError(res, err);}
			else {
				//record old name in case it gets changed
				var responseHTML = cxn.HTMLHeader + '<h1>Editing DLC for GameID '+rGameID+'</h1>\n\
					<form action="/dlc/update" method="post">\n\
					<input type="hidden" name="GameID" value="'+rGameID+'" />\n\
					<input type="hidden" name="DLCNameOld value="'+rDLCName+'" />\n\
					DLCName: <input name="DLCName" type="text" value="'+result[0].DLCName+' /><br />\n\
					DLCPrice: $<input name="DLCPrice" type="text" value="'+result[0].DLCPrice+' /><br />\n\
					DLCReleaseDate: <input name="DLCReleaseDate" type="text" value="'+result[0].DLCReleaseDate+'" /><br />\n\
					<input type="submit" value="Submit" />\n\
					</form>\n\
					<p><a href="/dlc/delete?GameID='+rGameID+'&DLCName='+rDLCName+'">Delete this DLC</a></p>\n'
					+ cxn.HTMLFooter;
				res.send(responseHTML);
			}
		});
	},

	update: function(req, res) {
		var rBody = req.body;
		var rGameID = parseInt(rBody.GameID);
		var rDLCName = rBody.DLCNameOld;
		delete rBody.GameID, rBody.DLCNameOld;
		var qry = mysql.format('UPDATE DLC SET ? WHERE GameID=? AND DLCName=?', [rBody, rGameID, rDLCName]);
		cxn.connection.query(qry, function(err, result) {
			if (err) {cxn.handleError(res, err);}
			else {
				var responseHTML = cxn.HTMLHeader + '<p>Successfully updated '+rDLCName+' for GameID '+rGameID;
				if (rBody.DLCName!=rDLCName) {
					responseHTML+=' (DLCName updated to '+rBody.DLCName+')';
				}
				responseHTML+='</p>\n'+
					'<p><a href="/games/view?'+rGameID+'">Back</a></p>\n'+
					cxn.HTMLFooter;
			}
		});
	},

	del: function(req, res) {
		var rGameID = parseInt(req.query.GameID);
		var rDLCName = req.query.DLCName;
		var qry = mysql.format('DELETE FROM DLC WHERE GameID=? AND DLCName=?', [rGameID, rDLCName]);
		cxn.connection.query(qry, function(err, result) {
			if (err) {cxn.handleError(res, err);}
			else {
				var responseHTML = cxn.HTMLHeader + '<p>Successfully deleted '+rDLCName+' from GameID '+rGameID+'</p>\n\
					<p><a href="/games/view?'+rGameID+'">Back</a></p>\n'+
					cxn.HTMLFooter;
				res.send(responseHTML);
			}
		});
	}
};