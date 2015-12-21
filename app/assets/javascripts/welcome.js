$(document).ready(function() {
  //alert("blah");

  var baseUrl = "http://devpoint-ajax-example-server.herokuapp.com/api/v1";


  // todo: CREATE 


  // update
  // $.ajax("", {
  //   type: "PUT",
  //   data: {
  //     //$(this).serializeArray();
  //   },
  //   success: function() {

  //   },
  //   error: function() {

  //   }
  // });
  $.ajax(baseUrl + "/products", {
    type: "GET",
    success: function(data) {
      var products = data.products;
      $.each(products, function(i, product) {
        if(product.quanity_on_hand > 0){
          $('#products_list').append(getListItem(product));
         }
      });
    },
    error: function(data) {

    }
  })


  $("#create_product_form").submit(function(e) {
    e.preventDefault();
    $.ajax(baseUrl + "/products", {
    type: "POST",
    data: $(this).serializeArray(),
    success: function(data) {
      var product = data.product;
      if(product.quanity_on_hand > 0){
        $('#products_list').append(getListItem(product));
      }  
    },
    error: function() {
      alert("error");
    }
  }); 
  })

  $(document).on("click", ".product_delete", function() {
    var productId = $(this).parent().parent().attr('id');
    var that = $(this).parent().parent();

    $.ajax(baseUrl + "/products/" + productId, {
      type: "DELETE",
      success: function() {
        that.slideToggle();
      },
      error: function() {

        alert("error");
      }
    })
  })
  var editId = null;
  $(document).on("click", ".product_edit", function() {
    var productId = $(this).parent().parent().attr('id');
    var that = $(this).parent().parent();
    $.ajax(baseUrl + "/products/" + productId, {
      type: "GET",
      success: function(data) {
        var product = data.product;
        editId = product.id
        $("#product_name").val(product.name);
        $("#product_base_price").val(product.base_price);
        $("#product_description").val(product.description);
        $("#product_quanity_on_hand").val(product.quanity_on_hand);
        $("#product_color").val(product.color);
        $("#product_weight").val(product.weight);
        $("#product_other_attributes").val(product.other_attributes);
        $("#product_add_button").addClass("hide")
        $("#product_edit_button").removeClass("hide")
      },
      error: function() {

      }
    });
  })

  $(document).on("click", "#product_edit_button", function() {
    var $form = $(this).parent();
    
    
    $.ajax(baseUrl + "/products/" + editId, {
      type: "PUT",
      data: $form.serializeArray(),
      success: function(data) {
   
        var product = data.product;
        if(product.quanity_on_hand > 0){
          $('#'+editId).html(getEditHTML(product));
        } else {
          $('#'+editId).remove();
        }
      },
      error: function() {
        alert("error");
      }
    })
  })

  function getListItem(product){
    return '<tr id=' + product.id + '><td data-id=' + product.id + ' id='+ product.id +'>' + product.name + '</td><td>' + product.base_price + '</td><td>' + product.description + '</td><td>' + product.quanity_on_hand + '</td><td>' + product.color + '</td><td>' + product.weight + '</td><td>' + product.other_attributes + '</td><td><button class="product_edit">Edit</button></td><td><button class="product_delete">Delete</button></td></tr>';

  }
  function getEditHTML(product){
    return '<td data-id=' + product.id + ' id='+ product.id +'>' + product.name + '</td><td>' + product.base_price + '</td><td>' + product.description + '</td><td>' + product.quanity_on_hand + '</td><td>' + product.color + '</td><td>' + product.weight + '</td><td>' + product.other_attributes + '</td><td><button class="product_edit">Edit</button></td><td><button class="product_delete">Delete</button></td>'
  }


}) 

