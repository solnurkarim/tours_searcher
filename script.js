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

	let starsQuery = '';

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

	let tourData;


	// отключение меню по порядку.
	// либо разместить обработчики здесь, либо убрать switch
	// и разместить вызовы функций в обработчиках ниже
	$('select').change(function(){
		console.log(this.id);
		switch(this.id){
			case 'city':
				disableCountries();
				break;
			case 'country':
				disableResorts();
				break;
			case 'resort':
				disableHotelCategories();
				disableHotels();
				disableTourDates();
				disableMeals();
				break;
			case 'hotel':
				hotelTagSelected = this.value;
				hotelTagSelectedId = hotelIdList[hotelTagSelected];
				$('#meals').val('reset');
				break;
			case 'meals':
				mealsTagSelected = this.value;
				mealsTagSelectedId = mealsIdList[mealsTagSelected];
		}
	});

	// убрать в load'ах методы .html()?
	// .html() заменить на .val('reset')?
	disableCountries();

	function disableCountries() {
		$('#country').prop('disabled', true);
		$('#country').html('<option>Направление</option>');
		disableResorts();
	}

	function disableResorts() {
		$('#resort').prop('disabled', true);
		$('#resort').html('<option>Курорты</option>');
		disableHotelCategories();
		disableHotels();
		disableTourDates();
		disableMeals();
	}

	function disableHotelCategories() {
		$('input:checkbox').each(function(){
			$(this).prop('disabled', true);
			$(this).prop('checked', false);
		});
	}

	function disableHotels() {
		$('#hotel').prop('disabled', true);
		$('#hotel').html('<option>Отели</option>');
	}

	function disableMeals() {
		$('#meals').prop('disabled', true).val('reset');
	}

	function disableTourDates() {
		$('#tour-dates').prop('disabled', true);
		$('#tour-dates').html('<option>Доступные даты тура</option>');
	}

	// загрузка списка города вылета
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
		cityTagSelected = $('#city option:selected').text();
		cityTagSelectedId = cityIdList[cityTagSelected];
		$('#country').prop('disabled', false);
		loadCountryTagList();
	});

	// загрузка списка стран по выбранному городу вылета
	function loadCountryTagList() {
		$('#country').html('<option>Направление</option>');
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
		$('#resort').val('reset');
		$('#resort').prop('disabled', false);
		loadResortTagList();
	});

	// загрузка списка курортов по выбранному направлению
	function loadResortTagList() {
		$('#resort').html('<option>Курорты</option>');
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
			$('input:checkbox').each(function(){
				$(this).prop('checked', false);
				$(this).prop('disabled', true);
			});
			return;
		}

		// $('select').each(function(){
		// 	$(this).prop('disabled', false);
		// });
		$('#hotel').prop('disabled', false);
		$('#meals').prop('disabled', false);
		$('#tour-dates').prop('disabled', false);
		loadHotelStarsList();
		loadTourDatesTagList();
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

			let starsId = 400;
			while(starsId <= 406){
				if(hotelStarsIdList[starsId]){
					$('#'+starsId).prop('disabled', false);
				} else {
					$('#'+starsId).prop('disabled', true);
				}
				starsId++;
			}
		});
	}

	// обработчик выбора категорий отелей
	// $('input:checkbox').change(function(){
	// 	starsArray = [];
	// 	$('input:checkbox').each(function(){
	// 		if( $(this).is(':checked') ){
	// 			starsArray.push($(this).attr('id'));
	// 		}
	// 	});
	// 	starsQuery = '&stars=' + starsArray.join();
	// 	loadHotelTagList();
	// });

	// обработчик выбора категорий отелей
	$('input:checkbox').on('change', function(){
		starsQuery = '&stars=' + $('input:checked').map(function(){
			return this.value;
		}).get().join(",");
		loadHotelTagList();
	});
	
	// загрузка списка отелей по выбранному курорту
	function loadHotelTagList() {
		$('#hotel').html('<option>Отели</option>');
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
	// подлежит к удалению
	function loadTourDatesTagList() {
		$('#tour-dates').html('<option>Доступные даты тура</option>');
		$.get(source + 'GetTourDates?dptCityId=' + cityTagSelectedId + "&countryId=" + countryTagSelectedId + '&resorts=' + resortTagSelectedId, function(data){
			tourDatesList = data.GetTourDatesResult.Data.dates;
			for(i=0; i<tourDatesList.length; i++){
				let tourDates = tourDatesList[i];
				$('#tour-dates').append('<option>'+ tourDates +'</option>');
			}
		});
	}

	// тестовая загрузка туров
	$('#search').click(function(){
		let login = 'login=' + $('#login').val();
		let password = '&password=' + $('#pass').val();
		$.get(source + 'GetTours?' + login + password + '&cityFromId=' + cityTagSelectedId + '&countryId=' + countryTagSelectedId + '&cities=' + resortTagSelectedId + '&meals=' + mealsTagSelectedId + starsQuery + '&hotels=' + hotelTagSelectedId, function(data){
			// $('#tour-results').text(JSON.stringify(data));
			$('#tours-wrapper').empty();
			if(!data.GetToursResult.ErrorMessage) {
				console.log('Data get succeeded');
				tourData = data.GetToursResult.Data.aaData;
				
				let tourIndex = 0;
				let tourIndexDataArray = [0,6,7,8,9,10,11,12,13,14,15,19];
				while(tourIndex < tourData.length) {
					let tourIndexData = 0;
					$('#tours-wrapper').append('<div class="tour-container"></div>');
					while(tourIndexData < tourIndexDataArray.length) {
						let tourContData = '';
						switch(tourIndexData) {
							case 0:
								tourContData = 'pricing-id';
								break;
							case 6:
								tourContData = 'tour-name';
								break;
							case 7:
								tourContData = 'hotel-name';
								break;
							case 8:
								tourContData = 'hotel-category';
								break;
							case 9:
								tourContData = 'room-type';
								break;
							case 10:
								tourContData = 'meals-type';
								break;
							case 11:
								tourContData = 'positioning-type';
								break;
							case 12:
								tourContData = 'departure-date';
								break;
							case 13:
								tourContData = 'arrival-date';
								break;
							case 14:
								tourContData = 'tour-nights';
								break;
							case 15:
								tourContData = 'tour-price';
								break;
							case 19:
								tourContData = 'resort-name';
								break;
							default:
								tourContData = 'tour-data';
						}
						$('.tour-container')[tourIndex].innerHTML += '<div class="' + tourContData + '">' + tourData[tourIndex][tourIndexData] + '</div>';
						tourIndexData++;
					}
					tourIndex++;
				}
			}
		});
	});
});