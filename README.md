# dataURL-and-Meta-batch-endpoint
b64-zipped-png => JSON containing dataURLs with custom metadata objects

Running example can be viewed/tested through [runkit](https://www.runkit.com) (formerly tonicdev): 
  * [notebook](https://runkit.com/rikku/dataurl-and-meta-batch-endpoint/1.0.0)
  * [endpoint](https://rikku.runkit.io/dataurl-and-meta-batch-endpoint/releases/1.0.0)

## Why did I create this endpoint?
When making dynamic graphic intensive apps or games using a JS web-IDE, I saw a need for a convenience tools for handling bitmaps (assuming that spritsheets are less convenient and unneeded performance-wise). 

## API
### Parameter 1: "assetURL"
A URL source responding with a b64-encoded zip, containing png files (no folders)

### Parameter 2: "assetMetaDefs" (optional)
A URL source responding with JSON object containing keys "ns" which string value is used as xm-namespace. "tags" [and "attributes"] contain property keys which are used for later tag recognition.

#### Example

```JSON
{
  "image1_background": {
    "ns": "testns",
    "tags": {
      "tagName1": {},
      "tagName2": {}
    },
    "attributes": {
      "attrName1": {},
      "attrName2": {}
    }
  }
}
```

### Response: "assets"
A JSON object with properties "results", which contains a property for each original png-image, and a "meta" property containing another list of images with each of their metadata. 

#### Example:
```JSON
{
  "results": 
    {
      "image1_background": "data:image/png;b64,iVBORw0KGgoAAAA...",
      "image1_foreground": "data:image/png;b64,iVBORw0KGgoAAAA...",
      "meta": {
        "image1_background": {
            "tagName1": "value1",
            "tagName2": "value2"
        },
        "image1_foreground": {
            "tagName1": "value3",
            "tagName2": "value4"
        }
    }
}
```

## Dependencies

* "Request 2.80.0" [NPM-module](https://www.npmjs.com/package/request), [github release](https://github.com/request/request/releases/tag/v2.80.0)
* "JSON-endpoint 1.0.0" [runkit-module](https://www.runkit.com/runkit/json-endpoint/1.0.0)
* "Data Helper Module 1.0.0" [runkit-module](https://www.runkit.com/rikku/data-helper-module/1.0.0), [my repo](https://github.com/fredrikku/bitmap-data-helpers)
* "Custom XMP-reader Module 1.0.0" [runkit-module](https://www.runkit.com/rikku/custom-xmp-reader-module/1.0.0), [my fork](https://github.com/fredrikku/xmp-reader), derived from [xmp-reader](https://github.com/shkuznetsov/xmp-reader)

## Licensing
MIT Licence
