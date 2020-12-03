
const genre_tag = document.querySelector('.genre_tag')
const sub_menu = document.querySelector('.genres')
const auth =  document.querySelector('.auth')


genre_tag.addEventListener(('mouseover'), () => {
    document.querySelector('.genres').classList.add("active")
    
})



genre_tag.addEventListener(('mouseleave'), () => {
   sub_menu.classList.remove("active")
    
})




auth.addEventListener(('click'), () => {
   
     console.log(req.session.auth)
 })
 




