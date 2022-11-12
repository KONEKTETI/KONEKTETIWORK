swal.fire('Please wait')
swal.showLoading()

firebase.auth().onAuthStateChanged(async (user) => {
    if(!user){
        window.location.href = "../index.html"
    } else {
        $("#email").val(user.email)    
        firebase.database().ref('accounts/').orderByChild('0').equalTo(user.email).once('value', function (snapshot) {
            var value = snapshot.val();
            console.log(value)
            if(!value){                   
                swal.close()
                Swal.fire({
                    icon: 'error',
                    title: 'Anda belum terdaftar',
                    html: 'silakan mendaftarkan diri di <br /><a href="https://docs.google.com/forms/d/e/1FAIpQLSfNfE_2YR_ZdfPuMst8IEAZs73NUVjx8aa_IhjJxgss-1mgLQ/viewform" target="_blank">Link Ini</a>',
                }).then(()=>{
                    firebase.auth().signOut().then(()=> {
                        console.log('logged out')
                    }).catch((error) => {
                        console.log(error.message)
                    })
                })
            } else {  
                firebase.database().ref('tokens/').orderByChild('0').equalTo(user.email).once('value', function (snapshot) {
                    var value = snapshot.val();
                    console.log(value)
                    if(value){
                        snapshot.forEach(function(child) {
                            token = child.val()[1]
                        });
                        firebase.database().ref('votes/').orderByChild('0').equalTo(token).once('value', function (snapshot) {
                            var value = snapshot.val();
                            if(value){
                                window.location.href = "thankyou.html"
                            } else {                    
                                Swal.close()
                            }
                        });
                    } else {
                        Swal.close()
                    }
                });
            }
        });
    }
})

$(document).ready(function(){
    $("#token").val(generateToken())    
    $("#tokenku").val($("#token").val())
    $("#formVote").submit(function(e) {
        e.preventDefault();
        $(":submit").attr("disabled", true);
        swal.fire('Please wait')
        swal.showLoading()
        var tokenValues = $("#formToken").serialize();   
        var values = $(this).serialize();               
        firebase.database().ref('tokens/').orderByChild('0').equalTo($("#email").val()).once('value', function (snapshot) {
            var value = snapshot.val();
            console.log(value)
            if(value){
                location.reload();
            } else {
                $.ajax({
                    url: "https://docs.google.com/forms/u/0/d/e/1FAIpQLSdamz3kBJs9n2NQs4XsrUzwEMzqMtnIWbzfGdH9TrIhLAaErA/formResponse",
                    type: "post",
                    dataType: 'jsonp',
                    crossDomain:true,
                    data: tokenValues ,
                    success: function (response) {
                        console.log(response);
                        vote(values);
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(textStatus, errorThrown);
                        vote(values);
                    }
                });
            }
        });
    })

})

function vote(values){
    $.ajax({
        url: "https://docs.google.com/forms/u/0/d/e/1FAIpQLSduSx7N_H04GKPY710IzWiolEpNXN8PnAy6FrcbO70CwWkXJw/formResponse", 
        type: "post",
        dataType: 'jsonp',
        crossDomain:true,
        data: values ,
        success: function (response) {
            console.log(response);
            setTimeout(function(){ 
                swal.close();
                window.location.href = "thankyou.html"
            }, 2000);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            setTimeout(function(){ 
                swal.close();
                window.location.href = "thankyou.html"
            }, 2000);
        }
    });
}

function vote1(){
    Swal.fire({
      title: 'Apakah Anda Yakin memilih calon nomor urut 1?',
      html: "anda tidak dapat mengubah pilihan setelah vote",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, saya yakin'
    }).then((result) => {
        if (result.isConfirmed) {
            $('#vote').val('1');
            $( "#formVote" ).submit();
        }
    })
  }

function vote2(){
  Swal.fire({
    title: 'Apakah Anda Yakin memilih calon nomor urut 2?',
    html: "anda tidak dapat mengubah pilihan setelah vote",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Ya, saya yakin'
  }).then((result) => {
        if (result.isConfirmed) {
            $('#vote').val('2');
            $( "#formVote" ).submit();
        }
  })
}

function vote3(){
    Swal.fire({
      title: 'Apakah Anda Yakin memilih calon nomor urut 3?',
      html: "anda tidak dapat mengubah pilihan setelah vote",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, saya yakin'
    }).then((result) => {
        if (result.isConfirmed) {
            $('#vote').val('3');
            $( "#formVote" ).submit();
        }
    })
  }