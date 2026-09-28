# Premnath English High School — Static Site

Hostinger-ready website for **Premnath English High School**. It uses the same kind of public pages as the S.R.T. Vidyamandir static site: a scrolling homepage and an admissions page. There is no database and no admin panel.

Address, phone, year, medium, and class levels come from the school’s [Justdial listing](https://www.justdial.com/Palghar/Premnath-English-High-School-Naigaon-East/022PXX22-XX22-180506191209-M6M5_BZDET). The listing does not publish an email, a full weekly timetable, or the two schooling levels hidden behind “+2 More”. Gallery pictures are stand-ins until the school shares its own.

## Files

```
index.html          Homepage
admissions.html     Application form and document checklist
css/styles.css      Layout and visual style
js/main.js          Navbar, academic tabs, gallery lightbox, stat counters
php/send.php        Sends contact and admission forms by email
```

Events, gallery captions, birthday names, and the school address are written in `index.html`. Class options for the application are in `admissions.html`.

## Details on the site

- Address: Survey No. 215, Near Hasova Mandir, Juhu Chandra, Naigaon Station Road, Naigaon East, Palghar 401208
- Phone: `07947105648` (the contact number shown on Justdial)
- Established: 2013
- English medium, co-ed, open until 6:00 pm
- Levels named on the listing: Nursery and Kindergarten. The page also lists the school under primary schools.

In `php/send.php`, set `$toEmail` to the school inbox and `$fromEmail` to a mailbox on the school domain. Justdial does not show an email address. The visitor’s address is used as Reply-To.

## Upload

1. In Hostinger hPanel, add the school domain and point its nameservers to Hostinger. If the domain is registered elsewhere, set the A record to the hosting IP shown in hPanel.
2. Create a mailbox on that domain and put it in `$fromEmail`.
3. Open **Files → File Manager** and go to `public_html`.
4. Upload the **contents** of this folder, not the folder itself. `index.html` must sit directly inside `public_html`, next to `css`, `js`, and `php`.
5. Visit the domain. The homepage should load without a path after the domain name.

## Check the site

- Click Home, About, Academics, Events, Gallery, Birthdays, and Contact. Each should scroll to that section.
- Switch the four academic stages and open a gallery photo.
- Open **Admissions**, fill the form with a test entry, and submit.
- Send a short message from the contact form.
- Confirm both emails arrive at the address in `$toEmail`. If they do not, check that `$fromEmail` matches a real mailbox on the domain.
