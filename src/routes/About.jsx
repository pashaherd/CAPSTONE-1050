import React from 'react'; 
import Nav from '../components/Nav'; 
import Footer from '../components/Footer'; 

export default function About(){
    return (
        <>
        <Nav/>
        <section className="about-wrap">
          <h1>About This Project</h1>
          <div className="about">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas maiores maxime iure, quasi at blanditiis porro vitae, aliquam est, obcaecati debitis corrupti fugiat tenetur architecto nisi perspiciatis odio eligendi ducimus modi necessitatibus velit corporis reprehenderit deserunt odit? Ex fugit nisi, atque, quod odio nihil natus reprehenderit quasi dolorem blanditiis exercitationem veniam dolor quia, maxime iusto deleniti laboriosam ab delectus quos sit? Saepe illum quibusdam perspiciatis maiores officia aliquid labore ipsum excepturi est eum molestiae ipsa sint, animi debitis molestias assumenda sed quis soluta repudiandae quidem nulla blanditiis. Nobis fugit magni recusandae laborum temporibus, rem nostrum assumenda corporis eligendi libero labore.</p>
          </div>
        </section>
        <Footer/>
        </>
    )
}