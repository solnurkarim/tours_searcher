$(document).ready(function(){
	const source = 'https://module.sletat.ru/Main.svc/';
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

	// загрузка списка городов вылета
	$.get(source + 'GetDepartCities?', function(data){
		cityList = data.GetDepartCitiesResult.Data;
		for(i=0; i<cityList.length; i++){
			let city = cityList[i].Name;
			cityIdList[city] = cityList[i].Id;
			// загрузка всех городов в список выбора
			// $('#city').append('<option>'+ city +'</option>');
		}
	});

	// загрузка списка всех возможных типов питания
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
		console.log($('#city option:selected').text());
		cityTagSelected = $('#city option:selected').text();
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
		if(resortTagSelectedId == undefined) {
			resortTagSelectedId = '';
		}
		loadHotelStarsTagList();
		loadTourDatesTagList();
	});

	// загрузка категорий отелей по выбранному курорту
	function loadHotelStarsTagList() {
		$('#hotel-stars').html('<option>Категории отелей</option');
		$.get(source + 'GetHotelStars?countryId=' + countryTagSelectedId + "&towns=" + resortTagSelectedId, function(data){
			hotelStarsList = data.GetHotelStarsResult.Data;
			for(i=0; i<hotelStarsList.length; i++){
				let hotelStars = hotelStarsList[i].Name;
				hotelStarsIdList[hotelStars] = hotelStarsList[i].Id;
				$('#hotel-stars').append('<option>'+ hotelStars +'</option>');
			}
		});
	}

	// обработчик выбора категории отелей
	$('#hotel-stars').change(function(){
		hotelStarsTagSelected = this.value;
		hotelStarsTagSelectedId = hotelStarsIdList[hotelStarsTagSelected];
		if(hotelStarsTagSelectedId == undefined) {
			hotelStarsTagSelectedId = '';
		}
		loadHotelTagList();
	});
	
	// загрузка списка отелей по выбранному курорту
	function loadHotelTagList() {
		$('#hotel').html('<option>Отели</option');
		$.get(source + 'GetHotels?countryId=' + countryTagSelectedId + "&towns=" + resortTagSelectedId + '&stars='+ hotelStarsTagSelectedId + '&all=-1', function(data){
			hotelList = data.GetHotelsResult.Data;
			for(i=0; i<hotelList.length; i++){
				let hotel = hotelList[i].Name;
				hotelIdList[hotel] = hotelList[i].Id;
				$('#hotel').append('<option>'+ hotel +'</option>');
			}
		});
	}

	// загрузка дат вылета по выбранному курорту
	// подлежит к удалению
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