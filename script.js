$(document).ready(function(){
	const source = 'http://module.sletat.ru/Main.svc/';
	let cityList;
	let cityTagSelected;
	let cityTagSelectedId;
	let cityIdList = new Object();

	let countryList;
	let countryTagSelected;
	let countryTagSelectedId;
	let countryIdList = new Object();

	let resortList;
	let resortTagSelected;
	let resortTagSelectedId;
	let resortIdList = new Object();

	let starsQueries = '';

	let hotelList;
	let hotelTagSelected;
	let hotelTagSelectedId;
	let hotelIdList = new Object();

	let mealsList;
	let mealsTagSelected;
	let mealsTagSelectedId;
	let mealsIdList = new Object();

	let tourDatesList;
	let tourDatesTagSelected;
	let tourDatesTagSelectedId;
	let tourDatesIdList = new Object();


	$.get(source + 'GetDepartCities?', function(data){
		cityList = data.GetDepartCitiesResult.Data;
		for(i=0; i<cityList.length; i++){
			let city = cityList[i].Name;
			cityIdList[city] = cityList[i].Id;
			$('#city').append('<option>'+ city +'</option');
		}
	});



	$('#city').change(function(){
		cityTagSelected = this.value;
		cityTagSelectedId = cityIdList[cityTagSelected];
		loadCountryTagList();
	});

	function loadCountryTagList() {
		$('#country').html('<option>Направление</option');
		$.get(source + 'GetCountries?townFromId=' + cityTagSelectedId, function(data){
			countryList = data.GetCountriesResult.Data;
			for (i=0; i<countryList.length; i++) {
			let country = countryList[i].Name;
			countryIdList[country] = countryList[i].Id;
			$('#country').append('<option>'+ country +'</option');
			}
		});
	}


	$('#country').change(function(){
		countryTagSelected = this.value;
		countryTagSelectedId = countryIdList[countryTagSelected];
		loadResortTagList();
	});

	function loadResortTagList() {
		$('#resort').html('<option>Курорт</option');
		$.get(source + 'GetCities?countryId=' + countryTagSelectedId, function(data){
			resortList = data.GetCitiesResult.Data;
			for(i=0; i<resortList.length; i++){
				let resort = resortList[i].Name;
				resortIdList[resort] = resortList[i].Id;
				$('#resort').append('<option>'+ resort +'</option');
			}
		});
	}

	// Заменить на добавление кодов категорий в массив с последующим 
	// объединением элементов массива в строку через разделитель.
	// Добавить остальные категории отелей
	$('input:checkbox').change(function(){
		
			starsQueries = '';
			if( $('#two-stars').is(':checked') ){
				starsQueries += '&stars=401';
			}
			if( $('#three-stars').is(':checked') ){
				if( $('#two-stars').is(':checked') ){
					starsQueries += ',402';
				} else {
					starsQueries += '&stars=402';
				}
			}
			if( $('#four-stars').is(':checked') ){
				if( $('#three-stars').is(':checked') || $('#two-stars').is(':checked') ){
					starsQueries += ',403';
				} else {
					starsQueries += '&stars=403';
				}
			}
			if( $('#five-stars').is(':checked') ){
				if( $('#four-stars').is(':checked') || $('#three-stars').is(':checked') || $('#two-stars').is(':checked') ){
					starsQueries += ',404';
				} else {
					starsQueries += '&stars=404';
				}
			}
			loadHotelTagList();
	});

	$('#resort').change(function(){
		resortTagSelected = this.value;
		resortTagSelectedId = resortIdList[resortTagSelected];
		if(resortTagSelectedId == undefined) {
			resortTagSelectedId = '';
		}
		loadHotelTagList();
	});

	function loadHotelTagList() {
		$('#hotel').html('<option>Отели</option');
		$.get(source + 'GetHotels?countryId=' + countryTagSelectedId + "&towns=" + resortTagSelectedId + starsQueries + '&all=-1', function(data){
			hotelList = data.GetHotelsResult.Data;
			for(i=0; i<hotelList.length; i++){
				let hotel = hotelList[i].Name;
				hotelIdList[hotel] = hotelList[i].Id;
				$('#hotel').append('<option>'+ hotel +'</option');
			}
		});
	}


	$('#meals').html('<option>Типы питания</option');
	$.get(source + 'GetMeals?', function(data){
		mealsList = data.GetMealsResult.Data;
		for(i=0; i<mealsList.length; i++){
			let meals = mealsList[i].Name;
			hotelIdList[meals] = mealsList[i].Id;
			$('#meals').append('<option>'+ meals +'</option');
		}
	});

	$('#hotel').change(function(){
		hotelTagSelected = this.value;
		hotelTagSelectedId = hotelIdList[hotelTagSelected];
		loadTourDatesTagList();
	});

	function loadTourDatesTagList() {
		$('#tour-dates').html('<option>Доступные даты тура</option');
		$.get(source + 'GetTourDates?dptCityId=' + cityTagSelectedId + "&countryId=" + countryTagSelectedId + '&resorts=' + resortTagSelectedId, function(data){
			tourDatesList = data.GetTourDatesResult.Data;
			for(i=0; i<tourDatesList.length; i++){
				let tourDates = tourDatesList[i].Name;
				tourDatesIdList[tourDates] = tourDatesList[i].Id;
				$('#tour-dates').append('<option>'+ tourDates +'</option');
			}
		});
	}


});