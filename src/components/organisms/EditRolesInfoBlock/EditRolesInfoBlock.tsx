import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'shared/components/common/Button/Button';

function EditRolesInfoBlock() {
  const [isFullText, setIsFullText] = useState(false);
  const history = useHistory();

  return (
    <div>
      <p>
        Выберите из Участников актив Объединения - людей, которые будут помогать вам заниматься организацией процессов.{' '}
        <br />
        Договоритесь, какие обязанности эти люди будут выполнять в рамках Объединения. <br />
        Откройте личную карточку каждого в блоке "Участники" и назначьте человеку роль, отметьте уровень доступа к
        панели администрирования.
      </p>

      {isFullText && (
        <>
          <strong>Роли - это ряд обязанностей, которые Участники выполняют в рамках данного Объединения:</strong>
          <ol>
            <li>
              Лидер объединения (лицо или лица, принимающие решения), а также:
              <ul>
                <li>Председатель.</li>
                <li>Руководитель.</li>
                <li>Директор.</li>
              </ul>
            </li>
            <li>Секретарь.</li>
            <li>Делопроизводитель.</li>
            <li>HR /специалист по кадрам, по работе с участниками.</li>
            <li>Юрист.</li>

            <li>Бухгалтер/счетовод.</li>
            <li>
              Руководитель (2-го уровня):
              <ul>
                <li>департамента,</li>
                <li>отдела,</li>
                <li>направления,</li>
                <li>проекта.</li>
              </ul>
            </li>
            <li>Член совета.</li>
            <li>Член контрольной комиссии.</li>
            <li>Инфоменеджер, PR и Smm-cпециалист.</li>
            <li>Другое (текстовое поле). </li>
          </ol>
          <strong>Права доступа - доступ к редактированию отдельных блоков в панели администрирования:</strong>
          <ol>
            <li>Админ (просмотр, редактирование и удаление информации всех блоков).</li>
            <li>
              Органайзер/проектный менеджер (просмотр cписков, cоздание нотификаций, создание и редактирование задач и
              мероприятий).
            </li>
            <li>Редактор (создание и редактирование статей и новостей).</li>
            <li>Финансовый менеджер (доступ к просмотру и редактированию блока "Финансы").</li>
            <li>Ревизор (просмотр всех блоков без права редактирования).</li>
          </ol>
        </>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {!isFullText && (
          <Button color="light" onClick={() => setIsFullText(true)}>
            Читать подробно
          </Button>
        )}

        <Button
          onClick={() => {
            history.push('./users/all');
          }}
        >
          Назначить
        </Button>
      </div>
    </div>
  );
}

export default EditRolesInfoBlock;
