
$(document).ready(function (){
	
	console.log(MAJCOM);
	console.log(TOS);
	console.log(TIS);
	console.log(GRADE);
	console.log(AFSC);
	console.log(DS);
	console.log(RS);
	console.log(FC);
	console.log(RDTM);
	console.log(LOC);
	
	if (MAJCOM != "0"){
		$('#dc-MAJ-chart').css("display","block");
	}
	if (TOS !="0"){
		$('#dc-TOS-chart').css("display","block");
	}
	if (TIS != '0'){
		$('#dc-TIS-chart').css("display","block");
	}
	if (GRADE != '0'){
		$('#dc-grade-chart').css("display","block");
	}
	if (AFSC != '0'){
		$('#dc-AFSC-chart').css("display","block");
	}
	if (DS !='0'){
		$('#dc-DS-chart').css("display","block");
	}
	if (FC != '0'){
		$('#dc-FC-chart').css("display","block");
	}
	if (RS != '0'){
		$('#dc-RS-chart').css("display","block");
	}
	if (RDTM != '0'){
		$('dc-RDTM-chart').css("display","block");
	}
	if (LOC != '0'){
		$('dc-location-chart').css("display","block");
	}
});
