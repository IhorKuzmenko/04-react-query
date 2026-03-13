import css from "./SearchBar.module.css";
import toast from "react-hot-toast";
import { Formik, Form, Field } from "formik";

interface SearchBarProps {
  onSubmit: (query: string) => void;
}

export default function SearchBar({ onSubmit }: SearchBarProps) {
  return (
    <header className={css.header}>
      <div className={css.container}>
        <a
          className={css.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>

        <Formik
          initialValues={{ query: "" }}
          validate={(values) => {
            const errors: { query?: string } = {};
            if (!values.query.trim()) {
              errors.query = "Please enter your search query.";
                toast.error("Please enter your search query.");
            }
            return errors;
          }}
          onSubmit={(values, { resetForm }) => {
            if (!values.query.trim()) return; 
            onSubmit(values.query.trim());
            resetForm();
          }}
        >
          {({ errors, touched }) => (
            <Form className={css.form}>
              <Field
                className={css.input}
                type="text"
                name="query"
                autoComplete="off"
                placeholder="Search movies..."
                autoFocus
              />
              <button className={css.button} type="submit">
                Search
              </button>

              {errors.query && touched.query && (
                <div className={css.error}>{errors.query}</div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </header>
  );
}