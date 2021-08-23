var vertexShader =
    [
        "precision mediump float;",
        "",
        "attribute vec2 vertPos;",
        "",
        "void main()",
        "{",
        "   gl_Position = vec4(vertPos, 0.0, 1.0);",
        "}",
    ].join("\n");

var fragmentShader =
    [
        "precision mediump float;",
        "",
        "void main()",
        "{",
        "   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);",
        "}",
    ].join("\n");

var InitDemo = function ()
{
    console.log("This is working");

    var canvas = document.getElementById("WebGL-surface");
    var gl = canvas.getContext("webgl");

    if (!gl)
    {
        console.log("WebGL is not support without experimental version");
        gl = canvas.getContext("experimental-webgl");
    }
    if (!gl)
    {
        alert("Your Brower does not support WebGL");
    }

    gl.clearColor(0.1, 0, 0.1, 0.5);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //Creating Shader
    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertShader, vertexShader);
    gl.shaderSource(fragShader, fragmentShader);

    gl.compileShader(vertShader);
    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS))
    {
        console.error("Error compiling vertex shader", gl.getShaderInfoLog(vertShader));
        return;
    }

    gl.compileShader(fragShader);
    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS))
    {
        console.error("Error compiling fragment shader", gl.getShaderInfoLog(fragShader));
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    {
        console.error("Error linking program", gl.getProgramInfoLog(program));
        return;
    }

    gl.validateProgram(program);
    if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS))
    {
        console.error("Error validating program", gl.getProgramInfoLog(program));
        return;
    }

    //Create Buffer
    var triangleVertices =
        [
            //x       y
            0.0, 0.5,
            -0.5, -0.5,
            0.5, -0.5
        ];

    var VBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

    var attributeLocation = gl.getAttribLocation(program, "vertPos");
    gl.vertexAttribPointer(
        attributeLocation,                  //Location
        2,                                  //Number of Element per Attribute           
        gl.FLOAT,                           //Type of Element
        gl.FALSE,
        2 * Float32Array.BYTES_PER_ELEMENT,  //Size of individual vertext
        0                                   //Offset from the beginning of data
    );

    gl.enableVertexAttribArray(attributeLocation);

    ///Main Render Loop
    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}