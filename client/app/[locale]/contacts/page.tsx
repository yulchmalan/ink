import Container from "@/components/Layout/Container/Container";
import Wrapper from "@/components/Layout/Wrapper/Wrapper";
import styles from "./page.module.scss";

export const metadata = {
  title: "Контакти | Ink",
};

export default function ContactsPage() {
  return (
    <Container>
      <Wrapper className={styles.wrapper}>
        <h1>Контакти</h1>

        <p>
          Якщо у вас виникли запитання, пропозиції або ви бажаєте повідомити про
          проблему — звʼяжіться з нами одним із наведених способів:
        </p>

        <h2>Технічна підтримка</h2>
        <p>
          Email:{" "}
          <a href="mailto:juliamalanjuk@gmail.com">juliamalanjuk@gmail.com</a>
          <br />
          Ми відповідаємо протягом 24 годин у робочі дні.
        </p>

        <h2>Питання щодо авторських прав / DMCA</h2>
        <p>
          Email:{" "}
          <a href="mailto:juliamalanjuk@gmail.com">juliamalanjuk@gmail.com</a>
          <br />У листі обовʼязково вкажіть посилання на порушуючий контент та
          підтвердження прав.
        </p>

        <h2>Соціальні мережі</h2>
        <ul>
          <li>
            Discord:{" "}
            <a href="https://discord.gg/ink-platform" target="_blank">
              discord.gg/ink-platform
            </a>
          </li>
          <li>
            Telegram:{" "}
            <a href="https://t.me/ink_platform" target="_blank">
              @ink_platform
            </a>
          </li>
          <li>
            Twitter / X:{" "}
            <a href="https://twitter.com/ink_platform" target="_blank">
              @ink_platform
            </a>
          </li>
        </ul>

        <h2>Поштова адреса (для офіційних запитів)</h2>
        <p>
          вул. Прикладна, 10, м. Івано-Франківськ, 76000, Україна
          <br />
          (за потреби офіційних документів або юридичної переписки)
        </p>

        <p>Ми цінуємо вашу думку й відкриті до співпраці.</p>
      </Wrapper>
    </Container>
  );
}
