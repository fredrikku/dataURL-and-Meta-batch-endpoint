
/* 
Respond to an request, returning a processed dataURL-batch 
*/
var request = require("request");
var helpers = require("@runkit/rikku/data-helper-module/1.0.0");
var xmpReader = require("@runkit/rikku/custom-xmp-reader-module/1.0.0");
var endpoint = require("@runkit/runkit/json-endpoint/1.0.0");

//don't declare the vars here, caching errors occur

endpoint(module.exports, async function retrieveImage(incomingRequest)
{
    var tempResults = {};
    var resultObj = { results: { meta: {} } };
    
    async function makeRequest (name, url) {
        return new Promise(
            function(resolve, reject) {
            
                request.get(url)
                    .on("response", (response) => { 
                            tempResults[name] = [];
                            tempResults[name+" content-type"] = response.headers['content-type']; 
                        })
                    .on("data", (data) => { tempResults[name].push(data); })
                    .on("end", () => { return resolve(Buffer.concat(tempResults[name]));                         })
                    .on("error", (error) => { throw error.message; return reject(); });
            }
        );
    }
    
    try {
        
        let batchPromise = makeRequest("assetURL", incomingRequest.query.assetURL);
        let batch = await batchPromise;
        
        let metaDefsPromise = makeRequest("assetMetaDefs", incomingRequest.query.assetMetaDefs);
        let metaDefs = await metaDefsPromise;
        
        //extract batch
        var dataURLCollection = await helpers.zip.zip2buf(batch);    
        
        //extract tag names
        metaDefs = JSON.parse(helpers.buffer.buf2str(metaDefs));
        
        //set metadata for each asset
        var listKeys = Object.keys(dataURLCollection);
        for(var i = 0; i < listKeys.length; i++){
            let fileBuffer = dataURLCollection[listKeys[i]];
            resultObj.results.meta[listKeys[i]] = await xmpReader(fileBuffer, metaDefs);
            resultObj.results[listKeys[i]] = helpers.dataUrl.makeOne(fileBuffer);
        }
            
    } catch(e) {
        return {error: "could not retrieve page, "+e.message }
    }
    
    return resultObj;
});


/* 

*/