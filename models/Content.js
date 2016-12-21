/**
 * Content模型
 */

var mongoose=require('mongoose');
var contentSchemas=require('../schemas/contents');
module.exports=mongoose.model('Content',contentSchemas);
