var refresh = "?1";

var socket = new io.Socket(null, {
    port: 8085
});
socket.connect();
socket.on('message', function(msg){
    console.log(JSON.stringify(msg))

    switch (msg.type) {
        case "script":
            core.add(msg);
            break;
        case "eval":
            eval(msg.eval);
            break;
        case "info":
            console.log(msg.info);
            break;
        case "alert":
            alert(msg.alert);
            break;
        default:
            break;
    }



});

var core = {

    "url" : "http://localhost:8085/",

    "add" : function(res){
        // res = {"name","type","src",?"onload"}
        console.log(res.name +' adding');
        
        switch (res.type) {
            case "module":
                s = document.createElement("script");
                s.setAttribute("src", core.url+res.src+refresh);
                s.setAttribute("onload", "alert('loading')");
                break;
            case "css":
                s = document.createElement("link");
                s.setAttribute("href", core.url+res.src+refresh);
                s.setAttribute("type", "text/css");
                s.setAttribute("rel", "stylesheet");
                break;
            case "script":
                s = document.createElement("script");
                s.setAttribute("src", core.url+res.src+refresh);
                break;
            case "img":
                s = document.createElement("img");
                s.setAttribute("src", core.url+res.src+refresh);
                break;
            case "svg":
                html = "";
                break;

            default:
                break;

        }

        if (res.onload)
            s.setAttribute("onload", res.onload);

        document.getElementsByTagId(res.type)[0].appendChild(s);

    },



    "init" : function(){
if (!localStorage.res)
localStorage.res = "{}";

core.res = JSON.parse(localStorage.res);

$.getJSON('modules/list.json', function(data) {
    res = {};
for (type in data){
    res[type] = {};
    for (i in data[type])
    {
        
        if (data[type][i].lastmodified > core.res[type][res].lastloaded ){
        res[type][i] = data[type][i]}
        else 
        res[type][i] =core.res[type][i]
    }
    
    
    }
 core.res = res
});

    }

}


// core.add_css("modules/leftbar/style")

//setTimeout("$('#leftbar').append('<img src=\"ressources/test.png\">')", 5000)


/*
 *
 *
        $( "#progressbar" ).progressbar({
            value: 50
        });

    "add_script" : function(src){
        console.log('add script : '+ src)
        var s = document.createElement("script");
        s.setAttribute("src", core.url+src+'.js?1');
        document.getElementsByTagName("head")[0].appendChild(s);
    },
    "add_css" : function(src){
        console.log('add css : '+ src)

        var s = document.createElement("link");
        s.setAttribute("href", core.url+src+'.css?1');
        s.setAttribute("type", "text/css");
        s.setAttribute("rel", "stylesheet");
        document.getElementsByTagName("head")[0].appendChild(s);

    },


    "add_res" : function(res){
        console.log('add res : '+ res.name)

        switch (res.type) {
            case "img":
                html = "<img onload='core.res_next()' src="+res.src+" />";
                break;
            case "svg":
                html = "";
                break;
            default:
                break;
        }

        $('#res').append(html);



    },


    "add_module" : function(name){
        console.log( name +' add')

        var s = document.createElement("script");
        s.setAttribute("src", "modules/"+name+"/script.js?1");
        s.setAttribute("onload", "core.module_load('"+name+"')");
        document.getElementsByTagName("head")[0].appendChild(s);

        core.modules[name] = {};
        core.modules[name].statut = "loading";
    },
 *
 */
