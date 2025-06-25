import styled from "styled-components";
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import PinterestIcon from '@mui/icons-material/Pinterest';
import YouTubeIcon from '@mui/icons-material/YouTube';

const StyledFooter = styled.footer`
    height: 200px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    justify-content: center;
    align-items: center;
    box-shadow: inset 0 4px 6px rgba(0, 0, 0, 0.1);
    .socials{
        display: flex;
        gap: 40px;
        >a{
            >svg{
                font-size: 30px;
                color: var(--color-background);
            }
            >svg:hover{
                color: var(--color-accentText);
            }
        }
    }
    .info{
        display: flex;
        gap: 40px;
        a{
            color: var(--color-background);
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
        }
        a:hover{
            text-decoration: underline solid 2px;
            text-underline-offset: 6px;
        }
    }
    .rights{
        >span{
            font-size: 13px;
            color: var(--color-background);
        }
    }
`

const Footer = () => {
    return ( 
        <StyledFooter>
            <div className="socials">
                <a href="https://www.instagram.com/" target="blank"><InstagramIcon /></a>
                <a href="https://www.facebook.com/" target="blank"><FacebookIcon /></a>
                <a href="https://www.pinterest.com/" target="blank"><PinterestIcon /></a>
                <a href="https://www.youtube.com/" target="blank"><YouTubeIcon /></a>
            </div>
            <div className="info">
                <a href="#">Cookies</a>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms and Uses</a>
            </div>
            <div className="rights">
                <span>© Copyrights TripTalk, 2025</span>
            </div>
        </StyledFooter>
     );
}
 
export default Footer;