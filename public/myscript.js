//understanding code
//for the cancel case to go back to the orginal value
let edit_button = '<button type="button" id="edit_out" class="btn btn-primary">Edit</button>';

//outlets: save button
$(document).on('click', '#save_out', function() {
  //debugger;
  let outlet_name = $(this).parent().parent().find(".input_class").val();
  if (outlet_name == ""){
    //outlet_name = '';
    alert("Please insert a name and then save!");
    return;
  }
  $(this).parent().parent().find(".input_class").hide();
  $(this).parent().parent().find(".name").text(outlet_name);
  $(this).parent().parent().find(".name").show();
  $(this).parent().hide();
  $(this).parent().parent().append(edit_button);
});

//outlets: cancel button
$(document).on('click', '#cancel_out', function() {
  //debugger;
  let outlet_name="";
  //if there was a input, change to the old input
  let name = $(this).parent().parent().find(".name").text();
  //alert(name);
  if (name) {
    $(this).parent().parent().find(".name").show();
    $(this).parent().parent().find(".input_class").val(name);

    $(this).parent().parent().find(".input_class").hide();
    $(this).parent().hide();
    $(this).parent().parent().append(edit_button);
  }
  // if there wasn't an input, alert the user to input a name
  // else {
  //   outlet_name = '';
  //   //does not allow the user cancel without saving once
  //   alert("Please insert a name!");
  //   return;
  // }
  $(this).parent().parent().find(".input_class").hide();
  $(this).parent().hide();
  $(this).parent().parent().hide(edit_button);

});

//outlets: edit button
$(document).on('click', '#edit_out', function() {
  //debugger;
  let outlet_name = $(this).parent().find(".name").text();
  $(this).hide();
  $(this).parent().find(".save_cancel").show();
  $(this).parent().find(".input_class").show();
  $(this).parent().find(".first_cell").find(".name").hide();
  $(this).parent().find(".input_class").value = outlet_name;
});


//variables: save button
$(document).on('click', '#save', function() {
  //record all the input values
  let var_name = $(this).parent().parent().find(".cell_one").find(".var_name").val();
  let var_type = $(this).parent().parent().find(".cell_two").find(".var_type").val();
  let var_value = $(this).parent().parent().find(".cell_three").find(".var_value").val();
  //check if all three inputs have been inserted
  if (var_name == "" || var_type == "" || var_value == ""){
    alert("Please insert all three blanks and then save!");
    return;
  }
  //check if the name has a correct naming format
  if (!var_name.match(/^[a-zA-Z_$][a-zA-Z_$0-9]*$/)) {
    alert("Please fill in a correct format of name ");
    return;
  }
  //check if the value matches the type
  if (var_type == "String") {
    if (!var_value.match(/^[a-zA-Z0-9_ ]*$/g)) {
      alert("Please fill in a String value.");
      return;
    }

  }
  else if (var_type == "Integer") {
    let num = parseInt(var_value);
    if (!var_value.match(/^[+-]?[1-9][0-9]*|0$/g)) {
      alert("Please fill in an Integer value.");
      return;
    }
    else if (!Number.isInteger(num)) {
      alert("Please fill in an Integer value.");
      return;
    }
    else if (var_value.match(/^[0-9]+.[0-9]+$/g)) {
      alert("This is a Double value, please select Double as" +
      " type if you want to keep the value.");
      return;
    }
  }
  else if (var_type == "Double") {
    if (!var_value.match(/^[0-9]+.[0-9]+$/g)) {
      alert("Please fill in a double value.");
      return;
    }
  }
  else if (var_type == "Boolean"){
    if (var_value != "true" && var_value != "false") {
      alert("Please fill in a boolean value.");
      return;
    }
  }

  else {
    alert("Your input have been saved successfully!");
  }




  //hide the input boxes
  $(this).parent().parent().find(".var_name").hide();
  $(this).parent().parent().find(".var_type").hide();
  $(this).parent().parent().find(".var_value").hide();
  //store the input values to static mode
  $(this).parent().parent().find(".var_name_text").text(var_name);
  $(this).parent().parent().find(".var_type_text").text(var_type);
  $(this).parent().parent().find(".var_value_text").text(var_value);
  //show the static mode
  $(this).parent().parent().find(".var_name_text").show();
  $(this).parent().parent().find(".var_type_text").show();
  $(this).parent().parent().find(".var_value_text").show();
  //hide the save&cancel and show the edit button
  $(this).parent().hide();
  $(this).parent().parent().find(".static_mode").show();

});

//variables: edit button
$('#edit').click(function()) {
  //record all the texts values from static mode
  let var_name = $(this).parent().parent().find(".var_name_text").text();
  let var_type = $(this).parent().parent().find(".var_type_text").text();
  let var_value = $(this).parent().parent().find(".var_value_text").text();
  //hide edit button and show cancel&save
  $(this).parent().hide();
  $(this).parent().parent().find(".edit_mode").show();
  //show all input boxes
  $(this).parent().parent().find(".var_name").show();
  $(this).parent().parent().find(".var_type").show();
  $(this).parent().parent().find(".var_value").show();
  //hide all static values
  $(this).parent().parent().find(".var_name_text").hide();
  $(this).parent().parent().find(".var_type_text").hide();
  $(this).parent().parent().find(".var_value_text").hide();
  //update the input boxes with static values
  $(this).parent().parent().find(".var_name").value = var_name;
  $(this).parent().parent().find(".var_type").value = var_type;
  $(this).parent().parent().find(".var_value").value = var_value;

});

//variables: cancel button
$(document).on('click', '#cancel', function() {
  let var_name="";
  let var_type="";
  let var_value="";

  //if there was an  input, record all the old static values
  let static_name = $(this).parent().parent().find(".var_name_text").text();
  let static_type = $(this).parent().parent().find(".var_type_text").text();
  let static_value = $(this).parent().parent().find(".var_value_text").text();
  //if there is saved values before, then go back to these values after clicking
  if (static_name) {
    $(this).parent().parent().find(".var_name_text").show();
    $(this).parent().parent().find(".var_type_text").show();
    $(this).parent().parent().find(".var_value_text").show();
    //store the static values to input boxes for edit purposes
    $(this).parent().parent().find(".var_name").val(static_name);
    $(this).parent().parent().find(".var_type").val(static_type);
    $(this).parent().parent().find(".var_value").val(static_value);
  }
  //if there wasn't an input, alert the user to input a name
  else {
    //outlet_name = '';
    //does not allow the user cancel without saving once
    alert("Please try to insert something in all three fields!");
    return;
  }
  //hide the input boxes
  $(this).parent().parent().find(".var_name").hide();
  $(this).parent().parent().find(".var_type").hide();
  $(this).parent().parent().find(".var_value").hide();
  //hide the save&cancel and show the edit button
  $(this).parent().hide();
  $(this).parent().parent().find(".static_mode").show();

});

$(document).ready(function () {

  //outlets: add button
  $('#button2').click(function () {
    var table = $('#table2');
    var body = $('#tableBody2');
    var nextId = body.find('tr').length + 1;
    table.append($('<tr><td style="display: none; float: none;">' + nextId + '</td>' +
    '<td class="first_cell"><input class="input_class" placeholder="Name your outlet">' +
    '<div class="name" style="display:none"></div>' + '</td>' +
    '<td class="save_cancel">\
        <button type="cancel" id="cancel_out" class="btn btn-danger">Cancel</button>\
        <button type="save" id="save_out" class="btn btn-success">Save</button>\
        </td>' +
      '</tr>'));
  });

  //variables: add button
  $('#button4').click(function () {
    var table = $('#table3');
    //var body = $('#tableBody3');
    //var nextId = body.find('tr').length + 1;
    table.append($('<tr method="post" action="/">' +
      '<td class="cell_one"><input class="var_name type="text" placeholder="name" name="name">' +
      '<div class="var_name_text" style="display:none"></div>' +
      '</td>' +
      '<td class="cell_two"><select class="var_type type="text" name="type">' +
      '<option></option>' +
      '<option>String</option>' +
      '<option>Integer</option>' +
      '<option>Double</option>' +
      '<option>Boolean</option></select>' +
      '<div class="var_type_text" style="display:none"></div>' +
      '</td>' +
      '<td class="cell_three"><input class="var_value type="text" placeholder="name" name="value">' +
      '<div class="var_value_text" style="display:none"></div>' +
      '</td>' +
      '<td class="edit_mode">\
        <button type="button" id="cancel" class="btn btn-danger">Cancel</button>\
        <button type="button" id="save" class="btn btn-success">Save</button>\
        </td>' +
      '<td class="static_mode" style="display:none">' +
      '<button type="button" id="edit" class="btn btn-primary">Edit</button></td>' +
      '</tr>'));
  });


});



//function for opening different tabs
function openTab(evt, tags) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tags).style.display = "block";
  evt.currentTarget.className += " active";
}


function resizeInput() {
  var input = document.querySelector('input'); // get the input element
  input.addEventListener('input', resizeInput); // bind the "resizeInput" callback on "input" event
  resizeInput.call(input); // immediately call the function
  this.style.width = this.value.length + "ch";
}

//alphanumeric algorithm
function checkAlphaNumeric(var_name.value) {
   var input = var_name.value;
   var numeric = /^([a-zA-Z0-9_]+)$/;
   if (!numeric.test(input)) {
     document.getElementById('errorText').style.display = '';
   } else {
     document.getElementById('errorText').style.display = 'none';
  }
 }
