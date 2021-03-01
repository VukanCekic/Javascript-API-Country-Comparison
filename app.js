const url = "https://restcountries.eu/rest/v2/all";
const searchBox = document.getElementById("search-box");

let countries = [];
let arr2 = [];
let myMap = new Map();

let xlabels = [];
let ylabels = [];

document.getElementById('refresh').onclick = function() {
  localStorage.clear();
  location.reload();
}




//Select and display countries
document.getElementById('submit').onclick = function() {
  let select = document.getElementById('pets');
  let selected = [...select.options]
                    .filter(option => option.selected)
                    .map(option => option.text);


  //if there is nothing saved at the start
  if(localStorage.getItem('data')==null){
    localStorage.setItem('data', '[]');
  }

  //add new data
  let selectedLength = selected.length;
  let arrayLength = arr2.length;
  let combined = selectedLength + arrayLength;
  
  
  let old_data = JSON.parse(localStorage.getItem('data'));
  if(combined <=4){
  old_data.push(selected);
}else{
  document.getElementById("popup_error").innerHTML = "Maximum array size is 4";
}
 
  //if array size bigger then 4 dont go to loop
  for (let elem of old_data) {
  //Concat arrays with helper function - SO PROUD OF THIS!!!!!!!!!
  arr2 = arrayUnique(arr2.concat(elem));
  }
 
  console.log(arr2);
  


  //save
  localStorage.setItem('data', JSON.stringify(arr2));
  let final = JSON.parse(localStorage.getItem('data'));
  //console.log(final.length);

  if(localStorage.getItem('data')!= null){
    document.getElementById('output-countries').innerHTML = 
    `<h4> ${final} </h4>`
  }
  
}


function arrayUnique(array) {
  var a = array.concat();
  for(var i=0; i<a.length; ++i) {
      for(var j=i+1; j<a.length; ++j) {
          if(a[i] === a[j])
              a.splice(j--, 1);
      }
  }

  return a;
}



//Search Functionality
searchBox.addEventListener("keyup", (e) => {
    const searchString = e.target.value.toLowerCase();
    const filteredCountries = countries.filter((country) => {
      return country.name.toLowerCase().includes(searchString);
    });
    displayCountries(filteredCountries);
  });


//FETCH API
const loadCountries = async () =>{
    try{
        const res = await fetch(url);
        countries = await res.json();
        displayCountries(countries);

        
       
    }
    catch(err){
        console.log(err);
    }
}

//Display Function
const displayCountries = (countries) =>{
    let counter = 1;

    let output = '<select class="custom-select p-3" id="pets"  multiple>';
    output += "<ul>";
    countries.forEach(function (country) {
      output += `<option value="${counter}">${country.name}</option>`;
      counter++;
    });
    output += "</ul";
    output += "</select>";
    document.getElementById("response").innerHTML = output;
}


document.getElementById('compare').onclick = function() {

let maxValueNumber;
let maxValueName;
let minValueNumber;
let minValueName;
let difference;
 
  
  //Adding countries that were sleceted to a map
  arr2.forEach(element => {
    
    for (let index = 0; index < countries.length; index++) {
      //console.log(countries[index].name);
         if(element == countries[index].name){
           //console.log(countries[index].name + " " + countries[index].population);
           myMap.set(countries[index].name, countries[index].population);
           }

    }
  });
   
  
  //Getting maximum and minium values with helper method
  maxValueNumber = Math.max(...myMap.values());
  maxValueName = getKey(maxValueNumber,myMap);

  minValueNumber = Math.min(...myMap.values());
  minValueName = getKey(minValueNumber,myMap);
  difference = maxValueNumber - minValueNumber;


  console.log(maxValueNumber);
  console.log(maxValueName); 

  console.log(minValueNumber);
  console.log(minValueName); 
  
  document.getElementById("maxText").innerHTML = `The most populated country is: <b>  ${maxValueName} </b> with  <b> ${maxValueNumber} </b> inhabitants.`  ;
  document.getElementById("minText").innerHTML = `The least populated country is: <b>  ${minValueName} </b> with  <b> ${minValueNumber} </b> inhabitants.`  ;
  document.getElementById("differenceText").innerHTML = `The difference of population is <b>  ${difference} </b> `  ;
  
  if(arr2.length < 2){
    document.getElementById("popup_error").innerHTML = "Less then 2 countries added";
   
  }else{ 
  chartIt(); //CALLING CHART FUNCTIONS
}
}

function getKey(val,myMap) {
  return [...myMap].find(([key, value]) => val === value)[0];
}

//let maxValueMap = new Map();
//maxValueMap = [...myMap.entries()].reduce((a, e ) => e[1] > a[1] ? e : a);
//const obj = Array.from(maxValueMap.entries()).reduce((main, [key, value]) => ({...main, [key]: value}), {})

loadCountries();




function chartIt(){

  for (let [key, value] of myMap) {
    console.log(key + " = " + value);
    xlabels = arrayUnique(xlabels.concat(key));
    ylabels = arrayUnique(ylabels.concat(value));
    console.log(ylabels);
    }

const ctx = document.getElementById('chart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: xlabels,
        datasets: [{
            label: '# of inhabitants',
            data: ylabels,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)'
               
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
                
            ],
            borderWidth: 3
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});
}

