<?php
declare(strict_types=1);

/**
 * Hostinger mail handler for the contact and admissions forms.
 *
 * From and To use the domain Hostinger serves this site on. Create those
 * two mailboxes in hPanel, or replace the addresses below with mailboxes
 * that already exist on this domain.
 */
$host = siteHost();
$toEmail = "office@" . $host;
$fromEmail = "noreply@" . $host;
$fromName = "Premnath English High School";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    exit("Method not allowed.");
}

$type = $_POST["form_type"] ?? "";
if ($type !== "contact" && $type !== "admission") {
    http_response_code(400);
    exit("Unknown form.");
}

if (!empty($_POST["company"])) {
    redirect(safeReturn($type, true));
}

$visitorEmail = clean((string) ($_POST["email"] ?? ""), 160);
if (!filter_var($visitorEmail, FILTER_VALIDATE_EMAIL) || preg_match("/[\r\n]/", $visitorEmail)) {
    redirect(safeReturn($type, false));
}

if ($type === "contact") {
    $name = clean((string) ($_POST["name"] ?? ""), 120);
    $phone = clean((string) ($_POST["phone"] ?? ""), 40);
    $subjectLine = clean((string) ($_POST["subject"] ?? ""), 160);
    $message = cleanBlock((string) ($_POST["message"] ?? ""), 4000);

    if ($name === "" || $subjectLine === "" || $message === "") {
        redirect(safeReturn($type, false));
    }

    $subject = "Website contact: " . $subjectLine;
    $body = implode("\n", [
        "A message was sent from the Premnath English High School website.",
        "",
        "Name: " . $name,
        "Email: " . $visitorEmail,
        "Phone: " . ($phone !== "" ? $phone : "Not provided"),
        "Subject: " . $subjectLine,
        "",
        "Message:",
        $message,
    ]);
} else {
    $student = clean((string) ($_POST["student_name"] ?? ""), 120);
    $parent = clean((string) ($_POST["parent_name"] ?? ""), 120);
    $phone = clean((string) ($_POST["phone"] ?? ""), 40);
    $dob = clean((string) ($_POST["date_of_birth"] ?? ""), 20);
    $gender = clean((string) ($_POST["gender"] ?? ""), 20);
    $className = clean((string) ($_POST["class_applying"] ?? ""), 40);
    $address = cleanBlock((string) ($_POST["address"] ?? ""), 500);
    $previous = clean((string) ($_POST["previous_school"] ?? ""), 160);
    $extra = cleanBlock((string) ($_POST["additional_info"] ?? ""), 2000);

    if ($student === "" || $parent === "" || $phone === "" || $dob === "" || $gender === "" || $className === "" || $address === "") {
        redirect(safeReturn($type, false));
    }

    $subject = "Admission application: " . $student;
    $body = implode("\n", [
        "A new admission application was submitted on the Premnath English High School website.",
        "",
        "Student name: " . $student,
        "Parent/guardian: " . $parent,
        "Email: " . $visitorEmail,
        "Phone: " . $phone,
        "Date of birth: " . $dob,
        "Gender: " . $gender,
        "Class applying for: " . $className,
        "Previous school: " . ($previous !== "" ? $previous : "Not provided"),
        "",
        "Address:",
        $address,
        "",
        "Additional information:",
        $extra !== "" ? $extra : "None",
    ]);
}

$headers = [
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "From: " . encodeName($fromName) . " <" . $fromEmail . ">",
    "Reply-To: " . $visitorEmail,
];

$sent = mail($toEmail, encodeSubject($subject), $body, implode("\r\n", $headers), "-f" . $fromEmail);
redirect(safeReturn($type, $sent));

function siteHost(): string
{
    $host = strtolower((string) ($_SERVER["SERVER_NAME"] ?? "localhost"));
    $host = preg_replace("/:\d+$/", "", $host) ?? $host;
    $host = preg_replace("/^www\./", "", $host) ?? $host;
    if (!preg_match("/\A[a-z0-9.-]+\z/", $host)) {
        return "localhost";
    }

    return $host;
}

function clean(string $value, int $max): string
{
    $value = trim(strip_tags($value));
    $value = str_replace(["\r", "\n"], " ", $value);
    return clip($value, $max);
}

function cleanBlock(string $value, int $max): string
{
    $value = trim(strip_tags($value));
    $value = str_replace("\r\n", "\n", $value);
    $value = str_replace("\r", "\n", $value);
    return clip($value, $max);
}

function clip(string $value, int $max): string
{
    if (function_exists("mb_substr")) {
        return mb_substr($value, 0, $max);
    }

    return substr($value, 0, $max);
}

function encodeName(string $name): string
{
    return "=?UTF-8?B?" . base64_encode($name) . "?=";
}

function encodeSubject(string $subject): string
{
    return "=?UTF-8?B?" . base64_encode($subject) . "?=";
}

function safeReturn(string $type, bool $ok): string
{
    if ($type === "admission") {
        return $ok ? "../admissions.html?sent=admission" : "../admissions.html?error=1";
    }

    return $ok ? "../index.html?sent=contact#contact" : "../index.html?error=1#contact";
}

function redirect(string $location): void
{
    header("Location: " . $location);
    exit;
}
