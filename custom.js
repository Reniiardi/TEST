


// FLIP ICON ON CLICK 
$(document).on( 'click', '#subParent', function (){
    $('#FuncPageIcon').toggleClass('fa-chevron-down fa-chevron-right');
});

// Do not close Drop down section from child 
$(document).on( 'click', '.sub-menu', function (e){
    e.stopPropagation();
});

// Do not close Drop down section from child 


// CheckBox input control, Max 3
function checkBox(T){
	if(T.is(':checked')){
		checkedcount +=1 ;
		T.attr('SEL',"1");
		T.parent().attr('SEL',"1");
		T.parent().next().attr('SEL',"1");
	//	console.log(checkedcount);
	} else {
		checkedcount-=1;
		
		T.attr('SEL',"0");
		T.parent().attr('SEL',"0");
		T.parent().next().attr('SEL',"0");
	//	console.log(checkedcount);
	}
	
	if (checkedcount >= 3){
		document.getElementById('reachedMax').setAttribute('style', "color:red;display:table;");
			$('#allChecks').find('.form-control[SEL=0]').css("background","GRAY");
			$('#allChecks').find('.input-group-addon[SEL=0]').css("background","GRAY");
			$('#allChecks').find('.single-checkbox[SEL=0]').prop('disabled',true);
			$('#allChecks').find('.form-control[SEL=1]').css("background","#80ff00");
			$('#allChecks').find('.input-group-addon[SEL=1]').css("background","#80ff00");
	
	} else {
		document.getElementById('reachedMax').setAttribute('style', "color:red;display:none;");
			$('#allChecks').find('.form-control[SEL=0]').css("background","WHITE");
			$('#allChecks').find('.input-group-addon[SEL=0]').css("background","WHITE");
			$('#allChecks').find('.single-checkbox[SEL=0]').removeAttr('disabled');
			$('#allChecks').find('.form-control[SEL=1]').css("background","#80ff00");
			$('#allChecks').find('.input-group-addon[SEL=1]').css("background","#80ff00");
	}
	
}







