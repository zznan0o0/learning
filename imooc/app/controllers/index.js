var Movie=require('../models/movie.js')
var Category=require('../models/Category.js')
//index page
exports.index=function(req,res){
	Category
		.find({})
		.populate({path:'movies',options:{limit:6}})
		.exec(function(err,categories){
			if(err){
				console.log(err);
			}

			res.render('index',{
				title:'imooc 首页',
				categories:categories		
			}) //传递数据
		})

}
//search page
exports.search=function(req,res){
	var catId=req.query.cat
	var q=req.query.q
	var page=parseInt(req.query.p,10) || 0
	var count=2
	var index=page*count

	if(catId){
		Category
			.find({_id:catId})
			.populate({
				path:'movies',
				select:'title poster'
				//options:{limit:6,skip:index}
			})
			.exec(function(err,categories){
				if(err){
					console.log(err)
				}

				var category=categories[0] || {}
				var movies=category.movies || []
				var results=movies.slice(index,index+count)

				res.render('results',{
					title:'imooc 结果列表页',
					keyword:category.name,
					currentPage:(page+1),
					query:'cat='+catId,
					totalPage:Math.ceil(movies.length/count),
					movies:results	
				}) //传递数据
			})
	}
	else{
		Movie
			.find({title:new RegExp(q+'.*','i')})
			.exec(function(err,movies){
				if(err){
					console.log(err)
				}

				var results=movies.slice(index,index+count)

				res.render('results',{
					title:'imooc 结果列表页',
					keyword:q,
					currentPage:(page+1),
					query:'q='+q,
					totalPage:Math.ceil(movies.length/count),
					movies:results	
				}) 
			})
	}
}