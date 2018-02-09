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

	let starsQuery = '';
	let starsArray = [];
	let hotelStarsList;
	let hotelStarsTagSelected;
	let hotelStarsTagSelectedId;
	let hotelStarsIdList = new Object();

	let hotelList;
	let hotelTagSelected;
	let hotelTagSelectedId;
	let hotelIdList = new Object();

	let mealsList;
	let mealsTagSelected;
	let mealsTagSelectedId;
	let mealsIdList = new Object();

	let tourDatesList;

	// загрузка списка стран
	$.get(source + 'GetDepartCities?', function(data){
		cityList = data.GetDepartCitiesResult.Data;
		for(i=0; i<cityList.length; i++){
			let city = cityList[i].Name;
			cityIdList[city] = cityList[i].Id;
			$('#city').append('<option>'+ city +'</option>');
		}
	});

	// загрузка списка типов питания
	$.get(source + 'GetMeals?', function(data){
		mealsList = data.GetMealsResult.Data;
		for(i=0; i<mealsList.length; i++){
			let meals = mealsList[i].Name;
			mealsIdList[meals] = mealsList[i].Id;
			$('#meals').append('<option>'+ meals +'</option>');
		}
	});

	// обработчик выбора города вылета
	$('#city').change(function(){
		cityTagSelected = this.value;
		cityTagSelectedId = cityIdList[cityTagSelected];
		loadCountryTagList();
	});

	// загрузка списка стран по выбранному городу вылета
	function loadCountryTagList() {
		$('#country').html('<option>Направление</option');
		$.get(source + 'GetCountries?townFromId=' + cityTagSelectedId, function(data){
			countryList = data.GetCountriesResult.Data;
			for (i=0; i<countryList.length; i++) {
			let country = countryList[i].Name;
			countryIdList[country] = countryList[i].Id;
			$('#country').append('<option>'+ country +'</option>');
			}
		});
	}

	// обработчик выбора направления
	$('#country').change(function(){
		countryTagSelected = this.value;
		countryTagSelectedId = countryIdList[countryTagSelected];
		loadResortTagList();
	});

	// загрузка списка курортов по выбранному направлению
	function loadResortTagList() {
		$('#resort').html('<option>Курорт</option');
		$.get(source + 'GetCities?countryId=' + countryTagSelectedId, function(data){
			resortList = data.GetCitiesResult.Data;
			for(i=0; i<resortList.length; i++){
				let resort = resortList[i].Name;
				resortIdList[resort] = resortList[i].Id;
				$('#resort').append('<option>'+ resort +'</option>');
			}
		});
	}

	// обработчик выбора курорта
	$('#resort').change(function(){
		resortTagSelected = this.value;
		resortTagSelectedId = resortIdList[resortTagSelected];
		if(!resortTagSelectedId) {
			resortTagSelectedId = '';
		}
		loadHotelStarsList();
		loadTourDatesTagList();
	});


	$('input:checkbox').change(function(){
		starsArray = [];
		$('input:checkbox').each(function(){
			if( $(this).is(':checked') ){
				starsArray.push($(this).attr('id'));
			}
		});
		starsQuery = '&stars=' + starsArray.join();
		// countryTagSelected = this.value;
		// countryTagSelectedId = countryIdList[countryTagSelected];
		loadHotelTagList();
	});

	// загрузка доступных категорий отелей по выбранному курорту,
	// разблокировка соответствующих checkbox'ов
	function loadHotelStarsList() {
		hotelStarsIdList = {};
		$.get(source + 'GetHotelStars?countryId=' + countryTagSelectedId + "&towns=" + resortTagSelectedId, function(data){
			hotelStarsList = data.GetHotelStarsResult.Data;
			for(i=0; i<hotelStarsList.length; i++){
				let hotelStars = hotelStarsList[i].Id;
				hotelStarsIdList[hotelStars] = hotelStarsList[i].Id;
			}

			let starsId = 401;
			while(starsId <= 404){
				if(hotelStarsIdList[starsId]){
					$('#'+starsId).attr('disabled', false);
				} else {
					$('#'+starsId).attr('disabled', true);
				}
				starsId++;
			}
		});
	}
	
	// загрузка списка отелей по выбранному курорту
	function loadHotelTagList() {
		$('#hotel').html('<option>Отели</option');
		$.get(source + 'GetHotels?countryId=' + countryTagSelectedId + "&towns=" + resortTagSelectedId + starsQuery + '&all=-1', function(data){
			hotelList = data.GetHotelsResult.Data;
			for(i=0; i<hotelList.length; i++){
				let hotel = hotelList[i].Name;
				hotelIdList[hotel] = hotelList[i].Id;
				$('#hotel').append('<option>'+ hotel +'</option>');
			}
		});
	}

	// загрузка дат вылета по выбранному курорту
	function loadTourDatesTagList() {
		$('#tour-dates').html('<option>Доступные даты тура</option');
		$.get(source + 'GetTourDates?dptCityId=' + cityTagSelectedId + "&countryId=" + countryTagSelectedId + '&resorts=' + resortTagSelectedId, function(data){
			tourDatesList = data.GetTourDatesResult.Data.dates;
			for(i=0; i<tourDatesList.length; i++){
				let tourDates = tourDatesList[i];
				$('#tour-dates').append('<option>'+ tourDates +'</option>');
			}
		});
	}
});