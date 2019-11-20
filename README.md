# Browserhash

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/tomorrow-night-bright.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js"></script>
<script src="dist/browserhash.js?{{site.github.build_revision}}"></script>

<div class="result"></div>

<script>
    var wrapper = document.querySelector('.result');
    var append = function (object) {
        var pre = document.createElement('pre');
        var code = document.createElement('code');
        code.className = 'json';
        code.innerHTML = JSON.stringify(object, null, 2);
        pre.appendChild(code);
        wrapper.appendChild(pre);
        hljs.highlightBlock(code);
    };
    var start = new Date().getTime();
    BrowserHash.then(function(data){
        append({
            time:String((new Date().getTime()-start)).concat(' ms')
        })
        append(data);
    });
</script>
