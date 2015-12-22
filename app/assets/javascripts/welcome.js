$(document).ready(function() {

  var baseUrl = "http://devpoint-ajax-example-server.herokuapp.com/api/v1";
  var editId = null;

  //SHOW ALL ITEMS
  $.ajax(baseUrl + "/products", {
    type: "GET",
    success: function(data) {
      var products = data.products;
      $.each(products, function(i, product) {
        if (product.quanity_on_hand > 0) {
          $('#products_list').append(getListItem(product));
        }
      });
    },
    error: function(data) {}
  });

  //PURCHASE HANDLER
  $(document).on('click', '.product_purchase', function() {
    var $that = $(this);
    var quantity_div = $(this).parent().parent().find('#individual_quantity');
    var quantity = parseInt(quantity_div.html());
    quantity = quantity - 1;
    var productId = $(this).parent().parent().attr('id');

    $.ajax(baseUrl + '/products/' + productId, {
      type: "PUT",
      data: {
        product: {
          quanity_on_hand: quantity
        }
      },
      success: function(data) {
        //remove item from html
        if (data.product.quanity_on_hand === 0) {
          $that.parent().parent().remove();
        } else {
          quantity_div.html(data.product.quanity_on_hand);
        }

      },
      error: function(data) {
        alert("purchase didn't work");
      }

    });
  });

  //CREATE A PRODUCT
  $("#create_product_form").submit(function(e) {
    e.preventDefault();
    $.ajax(baseUrl + "/products", {
      type: "POST",
      data: {
        product: {
          name: $("#product_name").val(),
          base_price: $("#product_base_price").val(),
          description: $("#product_description").val(),
          quanity_on_hand: $("#product_quanity_on_hand").val(),
          color: $("#product_color").val(),
          weight: $("#product_weight").val(),
          other_attributes: $("#product_other_attributes").val().split(',')

        }
      },
      success: function(data) {

        var product = data.product;
        if (product.quanity_on_hand > 0) {
          $('#products_list').append(getListItem(product));
          $("#create_product_form")[0].reset();
        }
      },
      error: function() {
        alert("error");
      }
    });
  });

  //DELETE A PRODUCT
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
    });
  });

  //FILLS FORM TO EDIT A PRODUCT
  $(document).on("click", ".product_edit", function() {
    var productId = $(this).parent().parent().attr('id');
    var that = $(this).parent().parent();
    $.ajax(baseUrl + "/products/" + productId, {
      type: "GET",
      success: function(data) {
        var product = data.product;
        editId = product.id;
        $("#product_name").val(product.name);
        $("#product_base_price").val(product.base_price);
        $("#product_description").val(product.description);
        $("#product_quanity_on_hand").val(product.quanity_on_hand);
        $("#product_color").val(product.color);
        $("#product_weight").val(product.weight);
        $("#product_other_attributes").val(product.other_attributes);
        $("#product_add_button").addClass("hide");
        $("#product_edit_button").removeClass("hide");
      },
      error: function() {

      }
    });
  });

   //PUTS THE FORM TO THE DB
  $(document).on("click", "#product_edit_button", function() {
    var $form = $(this).parent();


    $.ajax(baseUrl + "/products/" + editId, {
      type: "PUT",

      data: {
        product: {
          name: $("#product_name").val(),
          base_price: $("#product_base_price").val(),
          description: $("#product_description").val(),
          quanity_on_hand: $("#product_quanity_on_hand").val(),
          color: $("#product_color").val(),
          weight: $("#product_weight").val(),
          other_attributes: $("#product_other_attributes").val().split(',')

        }
      },
      success: function(data) {
        var product = data.product;
        if (product.quanity_on_hand > 0) {
          $('#' + editId).html(getEditHTML(product));
          $("#create_product_form")[0].reset();
          $("#product_edit_button").addClass("hide");
          $("#product_add_button").removeClass("hide");
        } else {
          $('#' + editId).remove();
        }
      },
      error: function() {
        alert("error");
      }
    });
  });

  //helpers that generate a row in table
  function getListItem(product) {
    return '<tr id=' + product.id + '><td data-id=' + product.id + ' id=' + product.id + '>' +
      product.name + '</td><td>' + product.base_price + '</td><td>' + product.description + '</td><td id="individual_quantity">' +
      product.quanity_on_hand + '</td><td>' + product.color + '</td><td>' + product.weight + '</td><td>' +
      product.other_attributes + '</td><td><button class="product_edit">Edit</button></td><td><button class="product_delete">Delete</button></td> <td><button class="product_purchase">Purchase</button></td></tr>';
  }

  function getEditHTML(product) {
    return '<td data-id=' + product.id + ' id=' + product.id + '>' + product.name + '</td><td>' +
      product.base_price + '</td><td>' + product.description + '</td><td id="individual_quantity">' + product.quanity_on_hand +
      '</td><td>' + product.color + '</td><td>' + product.weight + '</td><td>' + product.other_attributes +
      '</td><td><button class="product_edit">Edit</button></td><td><button class="product_delete">Delete</button></td><td><button class="product_purchase">Purchase</button></td>';
  }
});